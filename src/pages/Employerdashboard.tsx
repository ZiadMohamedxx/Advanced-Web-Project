import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Users, Star, LayoutDashboard, Building2,
  ArrowRight, Loader2, AlertCircle
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

type Candidate = {
  _id: string;
  name: string;
  email: string;
  disabilityType: string;
  preferredAccommodations: string;
};

type Application = {
  _id: string;
  candidate: Candidate;
  status: "submitted" | "accepted" | "rejected";
  compatibilityScore: number;
  jobTitle?: string;
};

type DashboardEntry = {
  job: { _id: string; title: string; location: string; workType: string };
  applicants: Application[];
  totalApplicants: number;
};

// ─── Static preview for non-logged-in users ───────────────────────────────────

const sampleCandidates = [
  { name: "Alex Rivera", role: "Front-End Developer", score: 94, skills: ["React", "TypeScript", "ARIA"], disability: "Hearing impairment" },
  { name: "Sam Chen", role: "Data Analyst", score: 87, skills: ["Python", "SQL", "Tableau"], disability: "Physical - wheelchair user" },
  { name: "Jordan Lee", role: "UX Researcher", score: 82, skills: ["User Testing", "Figma", "Analytics"], disability: "Visual - low vision" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 } as const,
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
} as const;

// ─── Main Component ───────────────────────────────────────────────────────────

export default function EmployerPortal() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dashboard, setDashboard] = useState<DashboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user  = localStorage.getItem("user");

    if (!token || !user) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    const parsed = JSON.parse(user);
    if (parsed.role !== "corporate") {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    // Logged in as employer — fetch real data
    setIsLoggedIn(true);

    const fetchDashboard = async () => {
      try {
        const res  = await fetch(`${API_BASE_URL}/jobs/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load dashboard");
        setDashboard(data.dashboard);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  // ── NOT logged in — blurred preview + sign up prompt ──
  if (!isLoggedIn) {
    return (
      <div className="container py-16 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Building2 className="h-3.5 w-3.5" /> Employer Portal
          </span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Matched Candidates
          </h1>
          <p className="text-muted-foreground mb-6">
            Sign up as an employer to see candidates matched to your job postings.
          </p>
          <div className="flex gap-3 justify-center">
          </div>
        </motion.div>

        {/* Blurred preview */}
        <div className="relative">
          <div className="space-y-4 blur-sm pointer-events-none select-none">
            {sampleCandidates.map((c) => (
              <Card key={c.name} className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{c.name}</h3>
                        <p className="text-sm text-muted-foreground">{c.role} • {c.disability}</p>
                        <div className="flex gap-1.5 mt-1.5 flex-wrap">
                          {c.skills.map((s) => (
                            <span key={s} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-center sm:text-right min-w-[120px]">
                      <div className="flex items-center gap-1 justify-center sm:justify-end mb-1">
                        <Star className="h-4 w-4 text-accent" />
                        <span className="text-2xl font-bold text-primary">{c.score}%</span>
                      </div>
                      <Progress value={c.score} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">Compatibility</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Overlay card */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-background/90 border rounded-xl px-8 py-6 text-center shadow-lg max-w-sm w-full mx-4">
              <Building2 className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="font-semibold text-lg mb-1">Sign in to view your matches</p>
              <p className="text-sm text-muted-foreground mb-4">
                Create an employer account to access real candidate data.
              </p>
              <div className="flex gap-2">
                <Button onClick={() => navigate("/signup")} className="gap-2 flex-1">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
                <Button onClick={() => navigate("/signin")} variant="outline" className="flex-1">
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── LOGGED IN — show real matched candidates ──
  const allApplicants = dashboard.flatMap((entry) =>
    entry.applicants.map((app) => ({ ...app, jobTitle: entry.job.title }))
  );

  return (
    <div className="container py-16 max-w-4xl">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Building2 className="h-3.5 w-3.5" /> Employer Portal
        </span>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Your Matched Candidates
        </h1>
        <p className="text-muted-foreground mb-6">
          Candidates who applied to your job postings, ranked by compatibility.
        </p>
        <Button variant="outline" className="gap-2" onClick={() => navigate("/employer-dashboard")}>
          <LayoutDashboard className="h-4 w-4" />
          Full Dashboard
        </Button>
      </motion.div>

      {/* No applicants yet */}
      {allApplicants.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">No applicants yet.</p>
          <p className="text-sm mb-6">Post a job to start receiving applications.</p>
          <Button onClick={() => navigate("/post-job")} className="gap-2">
            Post a Job <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Real matched candidates */}
      <div className="space-y-4">
        {allApplicants.map((app, i) => (
          <motion.div
            key={app._id}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <Card className="shadow-card hover:shadow-card-hover transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{app.candidate.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Applied for: <span className="font-medium text-foreground">{app.jobTitle}</span>
                      </p>
                      {app.candidate.disabilityType && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {app.candidate.disabilityType}
                        </p>
                      )}
                      <span className={`mt-1.5 inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        app.status === "accepted" ? "bg-green-100 text-green-800" :
                        app.status === "rejected" ? "bg-red-100 text-red-800"    :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="text-center sm:text-right min-w-[120px]">
                    <div className="flex items-center gap-1 justify-center sm:justify-end mb-1">
                      <Star className="h-4 w-4 text-accent" />
                      <span className="text-2xl font-bold text-primary">{app.compatibilityScore}%</span>
                    </div>
                    <Progress value={app.compatibilityScore} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">Compatibility</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}