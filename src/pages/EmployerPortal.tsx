import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Building2, FileText, SlidersHorizontal, Users, BarChart3,
  CheckCircle2, Star, ArrowRight, LayoutDashboard
} from "lucide-react";

const features = [
  { icon: FileText, title: "Post Job Requirements", desc: "Define job roles with detailed physical and cognitive requirement specifications." },
  { icon: SlidersHorizontal, title: "Define Physical Needs", desc: "Specify exact physical demands so our AI can match candidates with the right abilities." },
  { icon: BarChart3, title: "AI Compatibility Scoring", desc: "Get a 0-100% compatibility score for each candidate based on ability-based matching." },
  { icon: Users, title: "Matched Candidate Dashboard", desc: "View, filter, and connect with pre-matched candidates ranked by compatibility." },
];

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

export default function EmployerPortal() {
  const navigate = useNavigate();

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
                <Link to="/post-job">
                  <Button size="lg" className="gap-2">
                    Post a Job <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                {/* ✅ This now navigates to the real dashboard */}
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2"
                  onClick={() => navigate("/employer-dashboard")}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  View Dashboard
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-16" aria-labelledby="emp-features-heading">
        <h2 id="emp-features-heading" className="text-2xl md:text-3xl font-bold mb-8 text-center">
          Employer Tools
        </h2>
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
                <CardContent>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sample Dashboard Preview */}
      <section className="bg-secondary/30 py-16" aria-labelledby="dashboard-heading">
        <div className="container">
          <h2 id="dashboard-heading" className="text-2xl md:text-3xl font-bold mb-2 text-center">
            Matched Candidates Dashboard
          </h2>
          <p className="text-center text-muted-foreground mb-8 text-sm">
            Preview — open your real dashboard to see actual applicants.
          </p>
          <div className="max-w-3xl mx-auto space-y-4">
            {sampleCandidates.map((c, i) => (
              <motion.div key={c.name} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <Card className="shadow-card hover:shadow-card-hover transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{c.name}</h3>
                          <p className="text-sm text-muted-foreground">{c.role} • {c.disability}</p>
                          <div className="flex gap-1.5 mt-1.5">
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
              </motion.div>
            ))}
          </div>

          {/* CTA to open real dashboard */}
          <div className="text-center mt-8">
            <Button
              size="lg"
              className="gap-2"
              onClick={() => navigate("/employer-dashboard")}
            >
              <LayoutDashboard className="h-4 w-4" />
              Open My Real Dashboard
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}