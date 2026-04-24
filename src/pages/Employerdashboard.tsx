import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Users, Briefcase, CheckCircle2, XCircle, Clock,
  ChevronDown, ChevronUp, Star, Mail, Phone,
  FileText, Building2, Loader2, AlertCircle,
  PlusCircle, MapPin, Wifi, ArrowLeft, Lock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";

// ─── Types ────────────────────────────────────────────────────────────────────
type Candidate = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  disabilityType: string;
  preferredAccommodations: string;
  cvPath: string | null;
};

type Application = {
  _id: string;
  candidate: Candidate;
  status: "submitted" | "accepted" | "rejected";
  compatibilityScore: number;
  createdAt: string;
};

type Job = {
  _id: string;
  title: string;
  location: string;
  workType: string;
  industry: string;
  status: string;
  createdAt: string;
};

type DashboardEntry = {
  job: Job;
  applicants: Application[];
  totalApplicants: number;
};

// ─── Status badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { label: string; className: string }> = {
    submitted: { label: "Pending",  className: "bg-yellow-100 text-yellow-800" },
    accepted:  { label: "Accepted", className: "bg-green-100 text-green-800"   },
    rejected:  { label: "Rejected", className: "bg-red-100 text-red-800"       },
  };
  const { label, className } = map[status] ?? { label: status, className: "bg-muted text-muted-foreground" };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>{label}</span>;
};

const scoreColor = (score: number) =>
  score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-500";

const fadeUp = {
  hidden: { opacity: 0, y: 20 } as const,
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }),
} as const;

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EmployerDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  const [dashboard, setDashboard] = useState<DashboardEntry[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [expanded, setExpanded]   = useState<Record<string, boolean>>({});
  const [updating, setUpdating]   = useState<Record<string, boolean>>({});
  const [closing, setClosing]     = useState<Record<string, boolean>>({});
  const [user, setUser]           = useState<any>(null);

  useEffect(() => {
    const token  = localStorage.getItem("token");
    const stored = localStorage.getItem("user");

    if (!token || !stored) { navigate("/signin"); return; }

    const parsed = JSON.parse(stored);
    if (parsed.role !== "corporate") { navigate("/"); return; }

    setUser(parsed);

    const fetchDashboard = async () => {
      try {
        const res  = await fetch(`${API_BASE_URL}/jobs/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load dashboard");
        setDashboard(data.dashboard);

        if (data.dashboard.length > 0) {
          setExpanded({ [data.dashboard[0].job._id]: true });
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const toggleExpand = (jobId: string) =>
    setExpanded((prev) => ({ ...prev, [jobId]: !prev[jobId] }));

  // ── Accept / Reject application ──
  const handleStatusUpdate = async (applicationId: string, status: "accepted" | "rejected") => {
    setUpdating((prev) => ({ ...prev, [applicationId]: true }));
    try {
      const token = localStorage.getItem("token");
      const res   = await fetch(`${API_BASE_URL}/jobs/applications/${applicationId}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setDashboard((prev) =>
        prev.map((entry) => ({
          ...entry,
          applicants: entry.applicants.map((app) =>
            app._id === applicationId ? { ...app, status } : app
          ),
        }))
      );
      toast({ title: `Application ${status}`, description: `Candidate has been ${status}.` });
    } catch (err: any) {
      toast({ title: t("employerDashboard.errorTitle"), description: err.message, variant: "destructive" });
    } finally {
      setUpdating((prev) => ({ ...prev, [applicationId]: false }));
    }
  };

  // ── Close job ──
  const handleCloseJob = async (jobId: string, jobTitle: string) => {
    setClosing((prev) => ({ ...prev, [jobId]: true }));
    try {
      const token = localStorage.getItem("token");
      const res   = await fetch(`${API_BASE_URL}/jobs/${jobId}/close`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Update job status locally
      setDashboard((prev) =>
        prev.map((entry) =>
          entry.job._id === jobId
            ? { ...entry, job: { ...entry.job, status: "closed" } }
            : entry
        )
      );
      toast({ title: t("employerDashboard.jobClosed"), description: `"${jobTitle}" ${t("employerDashboard.jobClosedDesc")}` });
    } catch (err: any) {
      toast({ title: t("employerDashboard.errorTitle"), description: err.message, variant: "destructive" });
    } finally {
      setClosing((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  // ── Stats ──
  const totalJobs       = dashboard.length;
  const totalApplicants = dashboard.reduce((s, e) => s + e.totalApplicants, 0);
  const totalAccepted   = dashboard.reduce((s, e) => s + e.applicants.filter((a) => a.status === "accepted").length, 0);
  const totalPending    = dashboard.reduce((s, e) => s + e.applicants.filter((a) => a.status === "submitted").length, 0);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (error)   return <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-center"><AlertCircle className="h-10 w-10 text-destructive" /><p className="text-muted-foreground">{error}</p></div>;

  return (
    <div className="container py-10 max-w-5xl">

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">

        {/* ✅ Back button */}
        <button
          onClick={() => navigate("/employer-portal")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> {t("employerDashboard.backToPortal")}
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">{t("employerDashboard.title")}</h1>
            <p className="text-muted-foreground">
              {t("employerDashboard.welcome")} <span className="font-medium text-foreground">{user?.companyName || user?.name}</span> — {t("employerDashboard.manageJobsAndApplicants")}
            </p>
          </div>
          <Button className="gap-2 shrink-0" onClick={() => navigate("/post-job")}>
            <PlusCircle className="h-4 w-4" /> {t("employerDashboard.postAJob")}
          </Button>
        </div>
      </motion.div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: t("employerDashboard.jobsPosted"),      value: totalJobs,       icon: Briefcase,    color: "text-primary"    },
          { label: t("employerDashboard.totalApplicants"), value: totalApplicants, icon: Users,        color: "text-blue-500"   },
          { label: t("employerDashboard.accepted"),        value: totalAccepted,   icon: CheckCircle2, color: "text-green-500"  },
          { label: t("employerDashboard.pendingReview"),   value: totalPending,    icon: Clock,        color: "text-yellow-500" },
        ].map((stat, i) => (
          <motion.div key={stat.label} custom={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Card className="shadow-card">
              <CardContent className="p-5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ── No jobs ── */}
      {dashboard.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <Building2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">{t("employerDashboard.noJobsYet")}</p>
          <p className="text-sm mb-6">{t("employerDashboard.noJobsDesc")}</p>
          <Button onClick={() => navigate("/post-job")} className="gap-2">
            <PlusCircle className="h-4 w-4" /> {t("employerDashboard.postAJob")}
          </Button>
        </div>
      )}

      {/* ── Jobs list ── */}
      <div className="space-y-5">
        {dashboard.map((entry, i) => (
          <motion.div key={entry.job._id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Card className={`shadow-card overflow-hidden ${entry.job.status === "closed" ? "opacity-75" : ""}`}>

              {/* Job header */}
              <CardHeader className="flex flex-row items-center justify-between gap-4 pb-3">
                {/* Left: clickable area to expand */}
                <button onClick={() => toggleExpand(entry.job._id)} className="flex items-center gap-3 flex-1 text-left">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{entry.job.title}</CardTitle>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {entry.job.location || "Remote"}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Wifi className="h-3 w-3" /> {entry.job.workType}
                      </span>
                      <span className={`text-xs font-medium ${entry.job.status === "open" ? "text-green-600" : "text-red-500"}`}>
                        {entry.job.status}
                      </span>
                    </div>
                  </div>
                </button>

                {/* Right: applicants count + close button + expand */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-medium text-muted-foreground hidden sm:block">
                    {entry.totalApplicants} {entry.totalApplicants !== 1 ? t("employerDashboard.applicants") : t("employerDashboard.applicant")}
                  </span>

                  {/* ✅ Close Job button — only show if open */}
                  {entry.job.status === "open" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs gap-1 border-red-300 text-red-600 hover:bg-red-50 shrink-0"
                      disabled={closing[entry.job._id]}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloseJob(entry.job._id, entry.job.title);
                      }}
                    >
                      {closing[entry.job._id]
                        ? <Loader2 className="h-3 w-3 animate-spin" />
                        : <Lock className="h-3 w-3" />
                      }
                      {t("employerDashboard.closeJob")}
                    </Button>
                  )}

                  <button onClick={() => toggleExpand(entry.job._id)}>
                    {expanded[entry.job._id]
                      ? <ChevronUp  className="h-4 w-4 text-muted-foreground" />
                      : <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    }
                  </button>
                </div>
              </CardHeader>

              {/* Applicants list */}
              <AnimatePresence>
                {expanded[entry.job._id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <CardContent className="pt-0 pb-4">
                      {entry.applicants.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-6">
                          {t("employerDashboard.noApplicationsYet")}
                        </p>
                      ) : (
                        <div className="space-y-3 mt-2">
                          {entry.applicants.map((app) => (
                            <div key={app._id}
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border bg-background hover:bg-muted/20 transition-colors">

                              {/* Candidate info */}
                              <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                  <Users className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-semibold text-sm">{app.candidate.name}</p>
                                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <Mail className="h-3 w-3" /> {app.candidate.email}
                                    </span>
                                    {app.candidate.phone && (
                                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Phone className="h-3 w-3" /> {app.candidate.phone}
                                      </span>
                                    )}
                                  </div>
                                  {app.candidate.disabilityType && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {t("employerDashboard.disability")} {app.candidate.disabilityType}
                                    </p>
                                  )}
                                  {app.candidate.preferredAccommodations && (
                                    <p className="text-xs text-muted-foreground">
                                      {t("employerDashboard.accommodations")} {app.candidate.preferredAccommodations}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-2 mt-1.5">
                                    <StatusBadge status={app.status} />
                                    {app.candidate.cvPath && (
                                      <a
                                        href={`${API_BASE_URL.replace("/api", "")}/${app.candidate.cvPath}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-1 text-xs text-primary hover:underline"
                                      >
                                        <FileText className="h-3 w-3" /> {t("employerDashboard.viewCV")}
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Score + actions */}
                              <div className="flex flex-col items-end gap-2 min-w-[140px]">
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 text-accent" />
                                  <span className={`text-xl font-bold ${scoreColor(app.compatibilityScore)}`}>
                                    {app.compatibilityScore}%
                                  </span>
                                </div>
                                <Progress value={app.compatibilityScore} className="h-1.5 w-32" />
                                <p className="text-xs text-muted-foreground">{t("employerDashboard.compatibility")}</p>

                                {app.status === "submitted" && (
                                  <div className="flex gap-2 mt-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 text-xs gap-1 border-green-300 text-green-700 hover:bg-green-50"
                                      disabled={updating[app._id]}
                                      onClick={() => handleStatusUpdate(app._id, "accepted")}
                                    >
                                      {updating[app._id] ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
                                      {t("employerDashboard.accept")}
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 text-xs gap-1 border-red-300 text-red-700 hover:bg-red-50"
                                      disabled={updating[app._id]}
                                      onClick={() => handleStatusUpdate(app._id, "rejected")}
                                    >
                                      {updating[app._id] ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3" />}
                                      {t("employerDashboard.reject")}
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}