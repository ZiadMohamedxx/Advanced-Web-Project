import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Users, Briefcase, Brain, Eye, Keyboard, Mic, FileText,
  ArrowRight, CheckCircle2, Sparkles, Shield, Heart
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Candidate Portal",
    desc: "Accessible registration, disability-aware profiles, CV upload with OCR, and AI-powered job recommendations.",
    to: "/candidate-portal",
  },
  {
    icon: Briefcase,
    title: "Employer Portal",
    desc: "Post jobs with physical requirements, get AI compatibility scores, and access a matched candidate dashboard.",
    to: "/employer-portal",
  },
  {
    icon: Brain,
    title: "AI Matching Engine",
    desc: "Ability-based logic with 0-100% compatibility scores and personalized accommodation suggestions.",
    to: "/jobs",
  },
  {
    icon: FileText,
    title: "CV Analyzer",
    desc: "Tesseract/Google Vision OCR and NLP skill extraction to build comprehensive profiles automatically.",
    to: "/candidate-portal",
  },
  {
    icon: Mic,
    title: "Speech APIs",
    desc: "Text-to-Speech for blind support and Speech-to-Text for deaf support, fully integrated across the platform.",
    to: "/accessibility",
  },
  {
    icon: Eye,
    title: "Accessibility First",
    desc: "High contrast mode, ARIA labels, keyboard & voice navigation, video subtitles built into every feature.",
    to: "/accessibility",
  },
];

const steps = [
  { num: "01", title: "Create Your Profile", desc: "Register with accessible forms. Select your disability type and preferences." },
  { num: "02", title: "Upload Your CV", desc: "Our AI extracts your skills automatically using OCR and NLP technology." },
  { num: "03", title: "Get Matched", desc: "Our matching engine finds jobs based on your abilities, not limitations." },
  { num: "04", title: "Start Working", desc: "Connect with inclusive employers who value your unique talents." },
];

const stats = [
  { value: "15%", label: "of the world's population lives with a disability" },
  { value: "80%", label: "unemployment rate for people with disabilities in some countries" },
  { value: "100%", label: "of jobs on InclusiveHire are accessibility-verified" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden" aria-labelledby="hero-heading">
        <div className="absolute inset-0 bg-hero-gradient opacity-[0.04]" />
        <div className="container py-20 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                AI-Powered Inclusive Employment
              </span>
              <h1 id="hero-heading" className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
                Your Abilities Define{" "}
                <span className="text-gradient">Your Career</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                InclusiveHire connects talented individuals with disabilities to inclusive employers
                through AI-driven matching, accessible design, and personalized accommodations.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/signup">
                  <Button size="lg" className="gap-2 w-full sm:w-auto">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/employer-portal">
                  <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                    <Briefcase className="h-4 w-4" /> Hire Inclusively
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-secondary/30" aria-label="Platform statistics">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <p className="text-3xl md:text-4xl font-bold text-gradient">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20" aria-labelledby="features-heading">
        <div className="text-center mb-14">
          <h2 id="features-heading" className="text-3xl md:text-4xl font-bold mb-4">
            Platform Features
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Every feature is designed with accessibility and inclusion at its foundation.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <Link
                to={f.to}
                className="block p-6 rounded-xl bg-card border shadow-card hover:shadow-card-hover transition-all duration-300 group h-full"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-secondary/30 py-20" aria-labelledby="how-heading">
        <div className="container">
          <div className="text-center mb-14">
            <h2 id="how-heading" className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Getting started is simple and fully accessible.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="relative p-6 rounded-xl bg-card border text-center"
              >
                <span className="text-4xl font-bold text-primary/20">{step.num}</span>
                <h3 className="font-semibold mt-2 mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container py-20" aria-labelledby="values-heading">
        <div className="max-w-3xl mx-auto text-center">
          <h2 id="values-heading" className="text-3xl md:text-4xl font-bold mb-10">
            Built on <span className="text-gradient">Core Values</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Heart, title: "Inclusion", desc: "Every person deserves equal access to opportunities." },
              { icon: Shield, title: "Privacy", desc: "Your disability data is protected and only shared with consent." },
              { icon: CheckCircle2, title: "Ability-First", desc: "We match based on what you CAN do, not what you can't." },
            ].map((v, i) => (
              <motion.div
                key={v.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="p-6 rounded-xl border bg-card"
              >
                <v.icon className="h-8 w-8 text-accent mx-auto mb-3" aria-hidden="true" />
                <h3 className="font-semibold mb-1">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-hero-gradient py-20" aria-labelledby="cta-heading">
        <div className="container text-center">
          <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Find Your Path?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
            Join thousands of candidates and employers building a more inclusive workforce.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/candidate-portal">
              <Button size="lg" variant="secondary" className="gap-2">
                Join as Candidate <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/employer-portal">
              <Button size="lg" variant="outline" className="gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Join as Employer
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
