import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User, Upload, FileText, Sparkles, Briefcase, Settings,
  CheckCircle2, Eye, Ear, Hand, Brain as BrainIcon
} from "lucide-react";

const disabilityTypes = [
  { icon: Eye, label: "Visual", desc: "Blindness or low vision" },
  { icon: Ear, label: "Hearing", desc: "Deafness or hard of hearing" },
  { icon: Hand, label: "Physical", desc: "Mobility or motor impairments" },
  { icon: BrainIcon, label: "Cognitive", desc: "Learning or cognitive differences" },
];

const portalFeatures = [
  { icon: User, title: "Accessible Registration", desc: "Fully accessible sign-up with screen reader support, voice input, and simplified forms." },
  { icon: FileText, title: "Disability Type Selection", desc: "Choose your disability type to receive tailored accommodations and job matches." },
  { icon: Upload, title: "CV Upload & OCR", desc: "Upload your CV in any format. Our AI extracts skills using OCR and NLP technology." },
  { icon: Sparkles, title: "AI Profile Summary", desc: "Get an auto-generated professional profile highlighting your strengths and abilities." },
  { icon: Briefcase, title: "Job Recommendations", desc: "Receive personalized job matches based on your abilities, not limitations." },
  { icon: Settings, title: "Accommodation Preferences", desc: "Set your workplace accommodation needs to find the perfect fit." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 } as const,
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
} as const;

export default function CandidatePortal() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden" aria-labelledby="candidate-heading">
        <div className="absolute inset-0 bg-hero-gradient opacity-[0.04]" />
        <div className="container py-16 md:py-24 relative">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <User className="h-3.5 w-3.5" /> Candidate Portal
              </span>
              <h1 id="candidate-heading" className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                Your <span className="text-gradient">Abilities</span> Are Your Superpower
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Create an accessible profile, upload your CV, and let our AI match you with inclusive employers who value what you bring.
              </p>
              <div className="flex gap-3">
                <Button size="lg">Create Profile</Button>
                <Button size="lg" variant="outline">Upload CV</Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Disability Types */}
      <section className="container py-16" aria-labelledby="disability-heading">
        <h2 id="disability-heading" className="text-2xl md:text-3xl font-bold mb-8 text-center">
          Select Your Disability Type
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {disabilityTypes.map((d, i) => (
            <motion.button
              key={d.label}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="p-6 rounded-xl border bg-card hover:border-primary hover:shadow-card transition-all text-center group"
              aria-label={`Select ${d.label}: ${d.desc}`}
            >
              <d.icon className="h-8 w-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-semibold">{d.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{d.desc}</p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-secondary/30 py-16" aria-labelledby="features-heading">
        <div className="container">
          <h2 id="features-heading" className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Portal Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portalFeatures.map((f, i) => (
              <motion.div
                key={f.title}
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
                    <CardTitle className="text-base">{f.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Profile Preview */}
      <section className="container py-16" aria-labelledby="preview-heading">
        <h2 id="preview-heading" className="text-2xl md:text-3xl font-bold mb-8 text-center">
          AI-Generated Profile Preview
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <Card className="shadow-card">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Sample Candidate</h3>
                  <p className="text-muted-foreground">UX Designer • Visual Impairment</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-accent" /> AI Summary
                  </h4>
                  <p className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-lg">
                    "Experienced UX designer with 5+ years in accessible design. Proficient in Figma, screen reader testing, and WCAG compliance. Strong advocate for inclusive design patterns."
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Extracted Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {["UX Design", "Figma", "WCAG", "Screen Reader Testing", "Prototyping", "User Research"].map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Accommodation Needs</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Screen magnifier", "High contrast display", "Flexible hours"].map((a) => (
                      <span key={a} className="px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">{a}</span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}
