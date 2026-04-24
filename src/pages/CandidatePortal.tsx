import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User, Upload, FileText, Sparkles, Briefcase, Settings,
  CheckCircle2, Eye, Ear, Hand, Brain as BrainIcon,
  ArrowRight, Loader2, AlertCircle, MapPin, Wifi
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";

type Job = {
  _id: string;
  title: string;
  location: string;
  workType: string;
  employer: { name: string; companyName: string };
};

type Application = {
  _id: string;
  job: Job;
  status: "submitted" | "accepted" | "rejected";
  compatibilityScore: number;
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 } as const,
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
} as const;

const StatusBadge = ({ status }: { status: string }) => {
  const { t } = useLanguage();
  const map: Record<string, string> = {
    submitted: "bg-yellow-100 text-yellow-800",
    accepted:  "bg-green-100 text-green-800",
    rejected:  "bg-red-100 text-red-800",
  };
  const labelMap: Record<string, string> = {
    submitted: t("candidatePortal.submitted"),
    accepted:  t("candidatePortal.accepted"),
    rejected:  t("candidatePortal.rejected"),
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[status]}`}>
      {labelMap[status] || status}
    </span>
  );
};

export default function CandidatePortal() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const [isLoggedIn, setIsLoggedIn]       = useState(false);
  const [user, setUser]                   = useState<any>(null);
  const [applications, setApplications]   = useState<Application[]>([]);
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");

  // Disability types — labels come from translations
  const disabilityTypes = [
    { icon: Eye,       labelKey: "visual",    descKey: "visualDesc" },
    { icon: Ear,       labelKey: "hearing",   descKey: "hearingDesc" },
    { icon: Hand,      labelKey: "physical",  descKey: "physicalDesc" },
    { icon: BrainIcon, labelKey: "cognitive", descKey: "cognitiveDesc" },
  ];

  // Portal features — translated inline
  const portalFeatures = [
    { icon: User,      titleKey: "feature1Title", descKey: "feature1Desc" },
    { icon: FileText,  titleKey: "feature2Title", descKey: "feature2Desc" },
    { icon: Upload,    titleKey: "feature3Title", descKey: "feature3Desc" },
    { icon: Sparkles,  titleKey: "feature4Title", descKey: "feature4Desc" },
    { icon: Briefcase, titleKey: "feature5Title", descKey: "feature5Desc" },
    { icon: Settings,  titleKey: "feature6Title", descKey: "feature6Desc" },
  ];

  // workType translation helper
  const translateWorkType = (type: string) => {
    if (type === "remote")  return t("jobs.remote");
    if (type === "onsite")  return language === "ar" ? "في المكتب" : "Onsite";
    if (type === "hybrid")  return language === "ar" ? "هجين"      : "Hybrid";
    return type;
  };

  useEffect(() => {
    const token  = localStorage.getItem("token");
    const stored = localStorage.getItem("user");

    if (!token || !stored) { setIsLoggedIn(false); setLoading(false); return; }

    const parsed = JSON.parse(stored);
    if (parsed.role !== "candidate") { setIsLoggedIn(false); setLoading(false); return; }

    setIsLoggedIn(true);
    setUser(parsed);

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [appsRes, jobsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/jobs/my-applications`, { headers }),
          fetch(`${API_BASE_URL}/jobs`, { headers }),
        ]);
        const appsData = await appsRes.json();
        const jobsData = await jobsRes.json();
        if (!appsRes.ok) throw new Error(appsData.message);
        if (!jobsRes.ok) throw new Error(jobsData.message);
        setApplications(appsData.applications);
        setAvailableJobs(jobsData.jobs.slice(0, 3));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  if (error) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-center">
      <AlertCircle className="h-10 w-10 text-destructive" />
      <p className="text-muted-foreground">{error}</p>
    </div>
  );

  // ── NOT logged in ──
  if (!isLoggedIn) {
    return (
      <div>
        {/* Hero */}
        <section className="relative overflow-hidden" aria-labelledby="candidate-heading">
          <div className="absolute inset-0 bg-hero-gradient opacity-[0.04]" />
          <div className="container py-16 md:py-24 relative">
            <div className="max-w-2xl">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  <User className="h-3.5 w-3.5" /> {t("candidatePortal.title")}
                </span>
                <h1 id="candidate-heading" className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                  {language === "ar" ? (
                    <>
                      <span className="text-gradient">{t("candidatePortal.heroTitleHighlight")}</span>{" "}
                      {t("candidatePortal.heroTitle")}
                    </>
                  ) : (
                    <>
                      {t("candidatePortal.heroTitle")}{" "}
                      <span className="text-gradient">{t("candidatePortal.heroTitleHighlight")}</span>
                    </>
                  )}
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  {t("candidatePortal.heroDesc")}
                </p>
                <div className="flex gap-3">
                  <Button size="lg" onClick={() => navigate("/signup")} className="gap-2">
                    {t("candidatePortal.createProfile")} <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => navigate("/signin")}>
                    {t("signIn.signIn")}
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Disability Types */}
        <section className="container py-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            {t("candidatePortal.selectDisability")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {disabilityTypes.map((d, i) => (
              <motion.div
                key={d.labelKey}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="p-6 rounded-xl border bg-card text-center"
              >
                <d.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="font-semibold">{t(`candidatePortal.${d.labelKey}`)}</p>
                <p className="text-xs text-muted-foreground mt-1">{t(`candidatePortal.${d.descKey}`)}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Portal Features */}
        <section className="bg-secondary/30 py-16">
          <div className="container">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              {t("candidatePortal.portalFeatures")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portalFeatures.map((f, i) => (
                <motion.div
                  key={f.titleKey}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                >
                  <Card className="h-full shadow-card hover:shadow-card-hover transition-all">
                    <CardHeader className="flex flex-row items-center gap-3 pb-2">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <f.icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-base">{t(`candidatePortal.${f.titleKey}`)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{t(`candidatePortal.${f.descKey}`)}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ── LOGGED IN ──
  return (
    <div>
      {/* Welcome Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-[0.04]" />
        <div className="container py-16 md:py-20 relative">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <User className="h-3.5 w-3.5" /> {t("candidatePortal.title")}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                {language === "ar" ? (
                  <>
                    <span className="text-gradient">{user?.name?.split(" ")[0]}</span>
                    {t("candidatePortal.welcomeBack")} 👋
                  </>
                ) : (
                  <>
                    {t("candidatePortal.welcomeBack")},{" "}
                    <span className="text-gradient">{user?.name?.split(" ")[0]}</span> 👋
                  </>
                )}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {t("candidatePortal.welcomeDesc")}
              </p>
              <Button size="lg" onClick={() => navigate("/jobs")} className="gap-2">
                {t("candidatePortal.browseJobs")} <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Profile Card */}
      <section className="container py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{user?.name}</h2>
                  <p className="text-muted-foreground text-sm">{user?.email}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user?.disabilityType && (
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {user.disabilityType}
                      </span>
                    )}
                    {user?.phone && (
                      <span className="px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-xs">
                        {user.phone}
                      </span>
                    )}
                  </div>
                </div>
                <div className={`shrink-0 ${language === "ar" ? "text-left" : "text-right"}`}>
                  <p className="text-2xl font-bold text-primary">{applications.length}</p>
                  <p className="text-xs text-muted-foreground">{t("candidatePortal.applications")}</p>
                </div>
              </div>

              {user?.preferredAccommodations && (
                <div className="mt-4 p-3 rounded-lg bg-secondary/50">
                  <p className="text-xs font-medium mb-1">{t("candidatePortal.preferredAccommodations")}</p>
                  <p className="text-sm text-muted-foreground">{user.preferredAccommodations}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* My Applications */}
      <section className="container py-6">
        <h2 className="text-2xl font-bold mb-6">{t("candidatePortal.myApplications")}</h2>

        {applications.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="p-10 text-center text-muted-foreground">
              <Briefcase className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">{t("candidatePortal.noApplications")}</p>
              <p className="text-sm mb-4">{t("candidatePortal.noApplicationsDesc")}</p>
              <Button onClick={() => navigate("/jobs")} className="gap-2">
                {t("candidatePortal.browseJobs")} <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {applications.map((app, i) => (
              <motion.div
                key={app._id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Card className="shadow-card hover:shadow-card-hover transition-all">
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Briefcase className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{app.job.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {app.job.employer?.companyName || app.job.employer?.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <StatusBadge status={app.status} />
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {app.job.location || t("jobs.remote")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={`shrink-0 ${language === "ar" ? "text-left" : "text-right"}`}>
                        <p className="text-xl font-bold text-primary">{app.compatibilityScore}%</p>
                        <p className="text-xs text-muted-foreground">{t("candidatePortal.match")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Available Jobs */}
      <section className="bg-secondary/30 py-12 mt-6">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{t("candidatePortal.availableJobs")}</h2>
            <Button variant="outline" size="sm" onClick={() => navigate("/jobs")} className="gap-2">
              {t("candidatePortal.seeAll")} <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {availableJobs.length === 0 ? (
            <p className="text-muted-foreground text-center py-10">
              {t("candidatePortal.noJobsAvailable")}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {availableJobs.map((job, i) => (
                <motion.div
                  key={job._id}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                >
                  <Card className="shadow-card hover:shadow-card-hover transition-all h-full">
                    <CardContent className="p-5">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                        <Briefcase className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-1">{job.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {job.employer?.companyName || job.employer?.name}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" /> {job.location || t("jobs.remote")}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Wifi className="h-3 w-3" /> {translateWorkType(job.workType)}
                        </span>
                      </div>
                      <Button size="sm" className="w-full gap-2" onClick={() => navigate(`/apply/${job._id}`)}>
                        {t("jobs.apply")} <ArrowRight className="h-3 w-3" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}