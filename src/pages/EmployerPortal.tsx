import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  FileText,
  SlidersHorizontal,
  Users,
  BarChart3,
  Star,
  ArrowRight,
  LayoutDashboard,
  Loader2,
  AlertCircle,
  Briefcase,
  PlusCircle,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";

type Candidate = {
  _id: string;
  name: string;
  email: string;
  disabilityType: string;
};

type Application = {
  _id: string;
  candidate: Candidate;
  status: "submitted" | "accepted" | "rejected";
  compatibilityScore: number;
  realMatchScore?: number;
  matchedSkills?: string[];
  missingSkills?: string[];
  matchReasons?: string[];
  accessibilityReasons?: string[];
  jobTitle?: string;
};

type DashboardEntry = {
  job: {
    _id: string;
    title: string;
    location: string;
    workType: string;
  };
  applicants: Application[];
  totalApplicants: number;
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 } as const,
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.08, duration: 0.5 },
  }),
} as const;

export default function EmployerPortal() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [dashboard, setDashboard] = useState<DashboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const features = [
    {
      icon: FileText,
      titleKey: "feature1Title",
      descKey: "feature1Desc",
    },
    {
      icon: SlidersHorizontal,
      titleKey: "feature2Title",
      descKey: "feature2Desc",
    },
    {
      icon: BarChart3,
      titleKey: "feature3Title",
      descKey: "feature3Desc",
    },
    {
      icon: Users,
      titleKey: "feature4Title",
      descKey: "feature4Desc",
    },
  ];

  const statusLabel = (status: string) => {
    if (status === "accepted") return t("candidatePortal.accepted");
    if (status === "rejected") return t("candidatePortal.rejected");
    return t("candidatePortal.submitted");
  };

  const statusClass = (status: string) =>
    status === "accepted"
      ? "bg-green-100 text-green-800"
      : status === "rejected"
      ? "bg-red-100 text-red-800"
      : "bg-yellow-100 text-yellow-800";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const stored = localStorage.getItem("user");

    if (!token || !stored) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    const parsed = JSON.parse(stored);

    if (parsed.role !== "corporate") {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    setIsLoggedIn(true);
    setUser(parsed);

    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/jobs/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || t("common.error"));
        }

        setDashboard(data.dashboard);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [t]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  // ── NOT logged in ──
  if (!isLoggedIn) {
    return (
      <div>
        {/* Hero */}
        <section
          className="relative overflow-hidden"
          aria-labelledby="employer-heading"
        >
          <div className="absolute inset-0 bg-hero-gradient opacity-[0.04]" />
          <div className="container py-16 md:py-24 relative">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  <Building2 className="h-3.5 w-3.5" />
                  {t("employerPortal.title")}
                </span>

                <h1
                  id="employer-heading"
                  className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
                >
                  {language === "ar" ? (
                    <>
                      <span className="text-gradient">
                        {t("employerPortal.heroTitleHighlight")}
                      </span>{" "}
                      {t("employerPortal.heroTitle")}
                    </>
                  ) : (
                    <>
                      {t("employerPortal.heroTitle")}{" "}
                      <span className="text-gradient">
                        {t("employerPortal.heroTitleHighlight")}
                      </span>
                    </>
                  )}
                </h1>

                <p className="text-lg text-muted-foreground mb-6">
                  {t("employerPortal.heroDesc")}
                </p>

                <div className="flex gap-3">
                  <Button
                    size="lg"
                    className="gap-2"
                    onClick={() => navigate("/signup")}
                  >
                    {t("employerPortal.getStarted")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate("/signin")}
                  >
                    {t("signIn.signIn")}
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Employer Tools */}
        <section className="container py-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            {t("employerPortal.employerTools")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.titleKey}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Card className="h-full shadow-card hover:shadow-card-hover transition-all">
                  <CardHeader className="flex flex-row items-center gap-3 pb-2">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>

                    <CardTitle className="text-base">
                      {t(`employerPortal.${feature.titleKey}`)}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {t(`employerPortal.${feature.descKey}`)}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Real-only locked preview */}
        <section className="bg-secondary/30 py-16">
          <div className="container">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              {t("employerPortal.matchedCandidatesDashboard")}
            </h2>

            <div className="max-w-xl mx-auto">
              <Card className="shadow-card border-primary/10">
                <CardContent className="p-8 text-center">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-7 w-7 text-primary" />
                  </div>

                  <p className="font-semibold text-lg mb-2">
                    {t("employerPortal.signInToView")}
                  </p>

                  <p className="text-sm text-muted-foreground mb-6">
                    Sign in as a corporate account to view real candidate matches
                    from your posted jobs. No sample or fake candidate data is
                    displayed.
                  </p>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => navigate("/signup")}
                      className="gap-2 flex-1"
                    >
                      {t("employerPortal.getStarted")}
                      <ArrowRight className="h-4 w-4" />
                    </Button>

                    <Button
                      onClick={() => navigate("/signin")}
                      variant="outline"
                      className="flex-1"
                    >
                      {t("signIn.signIn")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ── LOGGED IN ──
  const allApplicants = dashboard.flatMap((entry) =>
    entry.applicants.map((application) => ({
      ...application,
      jobTitle: entry.job.title,
    }))
  );

  const sortedApplicants = [...allApplicants].sort(
    (a, b) =>
      (b.realMatchScore ?? b.compatibilityScore ?? 0) -
      (a.realMatchScore ?? a.compatibilityScore ?? 0)
  );

  const totalJobs = dashboard.length;
  const totalApplicants = allApplicants.length;
  const accepted = allApplicants.filter(
    (application) => application.status === "accepted"
  ).length;

  const stats = [
    {
      labelKey: "statsJobsPosted",
      value: totalJobs,
      icon: Briefcase,
    },
    {
      labelKey: "statsTotalApplicants",
      value: totalApplicants,
      icon: Users,
    },
    {
      labelKey: "statsAccepted",
      value: accepted,
      icon: BarChart3,
    },
  ];

  return (
    <div>
      {/* Welcome Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-[0.04]" />

        <div className="container py-16 md:py-20 relative">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Building2 className="h-3.5 w-3.5" />
                {t("employerPortal.title")}
              </span>

              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                {language === "ar" ? (
                  <>
                    <span className="text-gradient">
                      {user?.name?.split(" ")[0]}
                    </span>
                    {`، ${t("employerPortal.welcomeBack")}`} 👋
                  </>
                ) : (
                  <>
                    {t("employerPortal.welcomeBack")},{" "}
                    <span className="text-gradient">
                      {user?.name?.split(" ")[0]}
                    </span>{" "}
                    👋
                  </>
                )}
              </h1>

              <p className="text-lg text-muted-foreground mb-6">
                {t("employerPortal.welcomeDesc")}
              </p>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="gap-2"
                  onClick={() => navigate("/post-job")}
                >
                  <PlusCircle className="h-4 w-4" />
                  {t("employerPortal.postJob")}
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2"
                  onClick={() => navigate("/employer-dashboard")}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  {t("employerPortal.fullDashboard")}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container py-10">
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.labelKey}
              custom={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
            >
              <Card className="shadow-card">
                <CardContent className="p-5 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>

                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {t(`employerPortal.${stat.labelKey}`)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Matched Candidates */}
      <section className="bg-secondary/30 py-12 mt-4">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                {t("employerPortal.matchedCandidates")}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Real AI matching based on candidate CVs and your job
                requirements.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/employer-dashboard")}
              className="gap-2"
            >
              {t("employerPortal.fullDashboard")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {sortedApplicants.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium text-lg">
                {t("employerPortal.noApplicants")}
              </p>
              <p className="text-sm mb-6">
                {t("employerPortal.noApplicantsDesc")}
              </p>

              <Button onClick={() => navigate("/post-job")} className="gap-2">
                <PlusCircle className="h-4 w-4" />
                {t("employerPortal.postJob")}
              </Button>
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl mx-auto">
              {sortedApplicants.slice(0, 5).map((app, index) => {
                const score = app.realMatchScore ?? app.compatibilityScore ?? 0;
                const matchedSkills = app.matchedSkills || [];

                return (
                  <motion.div
                    key={app._id}
                    custom={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                  >
                    <Card className="shadow-card hover:shadow-card-hover transition-all">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <Users className="h-6 w-6 text-primary" />
                            </div>

                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-semibold">
                                  {app.candidate.name}
                                </h3>

                                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-semibold">
                                  <Sparkles className="h-3 w-3" />
                                  {score}% Match
                                </span>
                              </div>

                              <p className="text-sm text-muted-foreground">
                                {t("employerPortal.appliedFor")}{" "}
                                <span className="font-medium text-foreground">
                                  {app.jobTitle}
                                </span>
                              </p>

                              {app.candidate.disabilityType && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {app.candidate.disabilityType}
                                </p>
                              )}

                              {matchedSkills.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Matched:
                                  </span>

                                  {matchedSkills.slice(0, 5).map((skill) => (
                                    <Badge key={skill} className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                              <span
                                className={`mt-2 inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusClass(
                                  app.status
                                )}`}
                              >
                                {statusLabel(app.status)}
                              </span>
                            </div>
                          </div>

                          <div
                            className={`min-w-[120px] text-center sm:${
                              language === "ar" ? "text-left" : "text-right"
                            }`}
                          >
                            <div
                              className={`flex items-center gap-1 justify-center sm:${
                                language === "ar"
                                  ? "justify-start"
                                  : "justify-end"
                              } mb-1`}
                            >
                              <Star className="h-4 w-4 text-accent" />
                              <span className="text-2xl font-bold text-primary">
                                {score}%
                              </span>
                            </div>

                            <Progress value={score} className="h-2" />

                            <p className="text-xs text-muted-foreground mt-1">
                              Real AI Match
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}