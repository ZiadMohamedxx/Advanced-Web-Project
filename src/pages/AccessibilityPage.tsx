import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Eye, Keyboard, Mic, Subtitles, Contrast, ScanSearch,
  Volume2, Hand, Monitor, Accessibility
} from "lucide-react";

const features = [
  { icon: Contrast, title: "High Contrast Mode", desc: "Toggle high contrast for improved visibility. All colors meet WCAG AAA standards." },
  { icon: ScanSearch, title: "Screen Reader ARIA Labels", desc: "Every interactive element has proper ARIA labels and roles for full screen reader compatibility." },
  { icon: Keyboard, title: "Keyboard Navigation", desc: "Complete keyboard navigation with visible focus indicators. Tab through every feature without a mouse." },
  { icon: Mic, title: "Voice Navigation", desc: "Navigate and interact with the platform using voice commands for hands-free access." },
  { icon: Subtitles, title: "Video Subtitles", desc: "All video content includes accurate captions and subtitles in multiple languages." },
  { icon: Volume2, title: "Text-to-Speech", desc: "Built-in screen reading for blind and low-vision users. Hear any content read aloud." },
  { icon: Hand, title: "Speech-to-Text", desc: "Dictate messages, fill forms, and search jobs using voice input for deaf and motor-impaired users." },
  { icon: Monitor, title: "Responsive Design", desc: "Optimized for all screen sizes, zoom levels up to 400%, and assistive technology displays." },
];

const standards = [
  "WCAG 2.1 AA Compliant",
  "Section 508 Accessible",
  "ADA Compliant Design",
  "Screen Reader Tested",
  "Keyboard Fully Navigable",
  "Color Contrast Verified",
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 } as const,
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
} as const;

export default function AccessibilityPage() {
  return (
    <div>
      <section className="relative overflow-hidden" aria-labelledby="a11y-heading">
        <div className="absolute inset-0 bg-hero-gradient opacity-[0.04]" />
        <div className="container py-16 md:py-24 relative text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Accessibility className="h-8 w-8 text-primary" />
            </div>
            <h1 id="a11y-heading" className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              <span className="text-gradient">Accessibility</span> Is Not an Afterthought
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every pixel, every interaction, every feature is built with accessibility at its foundation.
              We don't retrofit—we design inclusively from day one.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container py-16" aria-labelledby="a11y-features-heading">
        <h2 id="a11y-features-heading" className="text-2xl md:text-3xl font-bold mb-8 text-center">
          Built-In Accessibility Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <Card className="h-full shadow-card hover:shadow-card-hover transition-all text-center">
                <CardHeader className="pb-2">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <f.icon className="h-6 w-6 text-primary" />
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

      <section className="bg-secondary/30 py-16" aria-labelledby="standards-heading">
        <div className="container text-center">
          <h2 id="standards-heading" className="text-2xl md:text-3xl font-bold mb-8">
            Compliance & Standards
          </h2>
          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
            {standards.map((s, i) => (
              <motion.span
                key={s}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="px-4 py-2 rounded-full bg-card border shadow-card text-sm font-medium flex items-center gap-2"
              >
                <Eye className="h-4 w-4 text-primary" /> {s}
              </motion.span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
