import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Building2, FileText, SlidersHorizontal, Users, BarChart3,
  Star, ArrowRight, LayoutDashboard, Loader2, AlertCircle,
  Briefcase, PlusCircle
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

type Candidate = { _id: string; name: string; email: string; disabilityType: string };
type Application = { _id: string; candidate: Candidate; status: "submitted"|"accepted"|"rejected"; compatibilityScore: number; jobTitle?: string };
type DashboardEntry = { job: { _id: string; title: string; location: string; workType: string }; applicants: Application[]; totalApplicants: number };

const features = [
  { icon: FileText,          title: "Post Job Requirements",     desc: "Define job roles with detailed physical and cognitive requirement specifications." },
  { icon: SlidersHorizontal, title: "Define Physical Needs",     desc: "Specify exact physical demands so our AI can match candidates with the right abilities." },
  { icon: BarChart3,         title: "AI Compatibility Scoring",  desc: "Get a 0-100% compatibility score for each candidate based on ability-based matching." },
  { icon: Users,             title: "Matched Candidate Dashboard",desc: "View, filter, and connect with pre-matched candidates ranked by compatibility." },
];

const sampleCandidates = [
  { name: "Alex Rivera", role: "Front-End Developer", score: 94, skills: ["React", "TypeScript", "ARIA"], disability: "Hearing impairment" },
  { name: "Sam Chen",    role: "Data Analyst",        score: 87, skills: ["Python", "SQL", "Tableau"],   disability: "Physical - wheelchair user" },
  { name: "Jordan Lee",  role: "UX Researcher",       score: 82, skills: ["User Testing", "Figma"],      disability: "Visual - low vision" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 } as const,
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
} as const;

export default function EmployerPortal() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser]             = useState<any>(null);
  const [dashboard, setDashboard]   = useState<DashboardEntry[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");

  useEffect(() => {
    const token  = localStorage.getItem("token");
    const stored = localStorage.getItem("user");

    if (!token || !stored) { setIsLoggedIn(false); setLoading(false); return; }

    const parsed = JSON.parse(stored);
    if (parsed.role !== "corporate") { setIsLoggedIn(false); setLoading(false); return; }

    setIsLoggedIn(true);
    setUser(parsed);

    const fetchDashboard = async () => {
      try {
        const res  = await fetch(`${API_BASE_URL}/jobs/dashboard`, { headers: { Authorization: `Bearer ${token}` } });
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

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (error)   return <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-center"><AlertCircle className="h-10 w-10 text-destructive" /><p className="text-muted-foreground">{error}</p></div>;

  // ── NOT logged in ──
  if (!isLoggedIn) {
    return (
      <div>
        <section className="relative overflow-hidden" aria-labelledby="employer-heading">
          <div className="absolute inset-0 bg-hero-gradient opacity-[0.04]" />
          <div className="container py-16 md:py-24 relative">
            <div className="max-w-2xl">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  <Building2 className="h-3.5 w-3.5" /> Employer Portal
                </span>
                <h1 id="employer-heading" className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                  Hire Based on <span className="text-gradient">Ability</span>
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Post inclusive job listings, define accommodations, and discover pre-matched candidates through AI-powered compatibility scoring.
                </p>
                <div className="flex gap-3">
                  <Button size="lg" className="gap-2" onClick={() => navigate("/signup")}>Get Started <ArrowRight className="h-4 w-4" /></Button>
                  <Button size="lg" variant="outline" onClick={() => navigate("/signin")}>Sign In</Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="container py-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Employer Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((f, i) => (
              <motion.div key={f.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <Card className="h-full shadow-card hover:shadow-card-hover transition-all">
                  <CardHeader className="flex flex-row items-center gap-3 pb-2">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <f.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">{f.title}</CardTitle>
                  </CardHeader>
                  <CardContent><p className="text-sm text-muted-foreground">{f.desc}</p></CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="bg-secondary/30 py-16">
          <div className="container">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Matched Candidates Dashboard</h2>
            <div className="relative max-w-3xl mx-auto">
              <div className="space-y-4 blur-sm pointer-events-none select-none">
                {sampleCandidates.map((c) => (
                  <Card key={c.name} className="shadow-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Users className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{c.name}</h3>
                            <p className="text-sm text-muted-foreground">{c.role} • {c.disability}</p>
                            <div className="flex gap-1.5 mt-1.5">
                              {c.skills.map((s) => <span key={s} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">{s}</span>)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right min-w-[120px]">
                          <div className="flex items-center gap-1 justify-end mb-1">
                            <Star className="h-4 w-4 text-accent" />
                            <span className="text-2xl font-bold text-primary">{c.score}%</span>
                          </div>
                          <Progress value={c.score} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-background/90 border rounded-xl px-8 py-6 text-center shadow-lg max-w-sm w-full mx-4">
                  <Building2 className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="font-semibold text-lg mb-1">Sign in to view your matches</p>
                  <p className="text-sm text-muted-foreground mb-4">Create an employer account to access real candidate data.</p>
                  <div className="flex gap-2">
                    <Button onClick={() => navigate("/signup")} className="gap-2 flex-1">Get Started <ArrowRight className="h-4 w-4" /></Button>
                    <Button onClick={() => navigate("/signin")} variant="outline" className="flex-1">Sign In</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ── LOGGED IN ──
  const allApplicants   = dashboard.flatMap((e) => e.applicants.map((a) => ({ ...a, jobTitle: e.job.title })));
  const totalJobs       = dashboard.length;
  const totalApplicants = allApplicants.length;
  const accepted        = allApplicants.filter((a) => a.status === "accepted").length;

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-[0.04]" />
        <div className="container py-16 md:py-20 relative">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Building2 className="h-3.5 w-3.5" /> Employer Portal
              </span>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                Welcome, <span className="text-gradient">{user?.name?.split(" ")[0]}</span> 👋
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Manage your job postings and review matched candidates from your dashboard.
              </p>
              <div className="flex gap-3">
                <Button size="lg" className="gap-2" onClick={() => navigate("/post-job")}>
                  <PlusCircle className="h-4 w-4" /> Post a Job
                </Button>
                <Button size="lg" variant="outline" className="gap-2" onClick={() => navigate("/employer-dashboard")}>
                  <LayoutDashboard className="h-4 w-4" /> Full Dashboard
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container py-10">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Jobs Posted",      value: totalJobs,       icon: Briefcase },
            { label: "Total Applicants", value: totalApplicants, icon: Users     },
            { label: "Accepted",         value: accepted,        icon: BarChart3 },
          ].map((stat, i) => (
            <motion.div key={stat.label} custom={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <Card className="shadow-card">
                <CardContent className="p-5 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <stat.icon className="h-5 w-5 text-primary" />
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
      </section>

      {/* Matched Candidates */}
      <section className="bg-secondary/30 py-12 mt-4">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Matched Candidates</h2>
            <Button variant="outline" size="sm" onClick={() => navigate("/employer-dashboard")} className="gap-2">
              Full Dashboard <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {allApplicants.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium text-lg">No applicants yet.</p>
              <p className="text-sm mb-6">Post a job to start receiving applications.</p>
              <Button onClick={() => navigate("/post-job")} className="gap-2">
                <PlusCircle className="h-4 w-4" /> Post a Job
              </Button>
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl mx-auto">
              {allApplicants.slice(0, 5).map((app, i) => (
                <motion.div key={app._id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                  <Card className="shadow-card hover:shadow-card-hover transition-all">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Users className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{app.candidate.name}</h3>
                            <p className="text-sm text-muted-foreground">Applied for: <span className="font-medium text-foreground">{app.jobTitle}</span></p>
                            {app.candidate.disabilityType && <p className="text-xs text-muted-foreground mt-0.5">{app.candidate.disabilityType}</p>}
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
          )}
        </div>
      </section>
    </div>
  );
}