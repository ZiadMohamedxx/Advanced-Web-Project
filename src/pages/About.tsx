import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Layers, Brain, FileText, Mic, Shield, Rocket, Target,
  Code2, Database, Globe
} from "lucide-react";

const roadmap = [
  { phase: "Phase 1", title: "Basic Infrastructure", desc: "Core portals, accessible registration, database schema for Users, Jobs, and Skills.", icon: Layers, status: "complete" },
  { phase: "Phase 2", title: "Matching Logic", desc: "Ability-based matching engine with 0-100% compatibility scoring and accommodation suggestions.", icon: Target, status: "current" },
  { phase: "Phase 3", title: "OCR Integration", desc: "CV upload with Tesseract/Google Vision OCR and NLP skill extraction.", icon: FileText, status: "upcoming" },
  { phase: "Phase 4", title: "Speech APIs", desc: "Text-to-Speech for blind support and Speech-to-Text for deaf support.", icon: Mic, status: "upcoming" },
  { phase: "Phase 5", title: "AI Enhancements", desc: "Advanced matching algorithms, predictive analytics, and personalized recommendations.", icon: Brain, status: "upcoming" },
];

const architecture = [
  { icon: Code2, title: "Frontend: React", desc: "Accessible, responsive UI with ARIA labels, keyboard navigation, and high contrast support." },
  { icon: Database, title: "Backend: Cloud-Powered", desc: "Scalable serverless backend with authentication, database, and edge functions." },
  { icon: Globe, title: "Database: Users, Jobs, Skills", desc: "Relational schema linking candidates, employers, jobs, skills, and accommodations." },
];

const futureFeatures = [
  { icon: Shield, title: "Gov Disability Verification", desc: "Integration with government databases for streamlined disability verification." },
  { icon: Rocket, title: "Inclusive Certifications", desc: "Employer certification program for accessibility and inclusion standards." },
  { icon: Globe, title: "Sign Language Avatars", desc: "AI-powered sign language translation through animated avatars." },
  { icon: Brain, title: "AI Mock Interviews", desc: "Practice interviews with AI that adapts to your communication needs." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 } as const,
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
} as const;

export default function About() {
  return (
    <div>
      <section className="relative overflow-hidden" aria-labelledby="about-heading">
        <div className="absolute inset-0 bg-hero-gradient opacity-[0.04]" />
        <div className="container py-16 md:py-24 relative text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 id="about-heading" className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              About <span className="text-gradient">InclusiveHire</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're building the future of inclusive employment—where every person's abilities are recognized, valued, and matched with the right opportunities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Architecture */}
      <section className="container py-16" aria-labelledby="arch-heading">
        <h2 id="arch-heading" className="text-2xl md:text-3xl font-bold mb-8 text-center">System Architecture</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {architecture.map((a, i) => (
            <motion.div key={a.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <Card className="h-full shadow-card text-center">
                <CardContent className="p-6">
                  <a.icon className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-1">{a.title}</h3>
                  <p className="text-sm text-muted-foreground">{a.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section className="bg-secondary/30 py-16" aria-labelledby="roadmap-heading">
        <div className="container">
          <h2 id="roadmap-heading" className="text-2xl md:text-3xl font-bold mb-8 text-center">Development Roadmap</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {roadmap.map((r, i) => (
              <motion.div key={r.phase} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <Card className={`shadow-card transition-all ${r.status === "current" ? "border-primary" : ""}`}>
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center shrink-0 ${
                      r.status === "complete" ? "bg-primary/20" : r.status === "current" ? "bg-accent/20" : "bg-muted"
                    }`}>
                      <r.icon className={`h-6 w-6 ${
                        r.status === "complete" ? "text-primary" : r.status === "current" ? "text-accent" : "text-muted-foreground"
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{r.phase}</span>
                        {r.status === "complete" && <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">Complete</span>}
                        {r.status === "current" && <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">In Progress</span>}
                      </div>
                      <h3 className="font-semibold">{r.title}</h3>
                      <p className="text-sm text-muted-foreground">{r.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Future */}
      <section className="container py-16" aria-labelledby="future-heading">
        <h2 id="future-heading" className="text-2xl md:text-3xl font-bold mb-8 text-center">Future Scalability</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {futureFeatures.map((f, i) => (
            <motion.div key={f.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <Card className="h-full shadow-card hover:shadow-card-hover transition-all">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
