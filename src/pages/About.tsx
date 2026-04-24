import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Layers, Brain, FileText, Mic, Shield, Rocket, Target,
  Code2, Database, Globe, Users, Briefcase, BarChart3,
  CheckCircle2, Star, Building2, Heart, Award, TrendingUp
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const fadeUp = {
  hidden:  { opacity: 0, y: 20 } as const,
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
} as const;

export default function About() {
  const { t, language } = useLanguage();
  const [role, setRole] = useState<"candidate" | "corporate" | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setRole(parsed.role === "corporate" ? "corporate" : parsed.role === "candidate" ? "candidate" : null);
    }
  }, []);

  // ── Arrays built with t() so they re-render on language change ──

  const candidateSteps = [
    { icon: Users,        titleKey: "candidateStep1Title", descKey: "candidateStep1Desc" },
    { icon: FileText,     titleKey: "candidateStep2Title", descKey: "candidateStep2Desc" },
    { icon: Target,       titleKey: "candidateStep3Title", descKey: "candidateStep3Desc" },
    { icon: Briefcase,    titleKey: "candidateStep4Title", descKey: "candidateStep4Desc" },
    { icon: CheckCircle2, titleKey: "candidateStep5Title", descKey: "candidateStep5Desc" },
    { icon: Star,         titleKey: "candidateStep6Title", descKey: "candidateStep6Desc" },
  ];

  const candidateValues = [
    { icon: Heart,  titleKey: "candidateValue1Title", descKey: "candidateValue1Desc" },
    { icon: Shield, titleKey: "candidateValue2Title", descKey: "candidateValue2Desc" },
    { icon: Globe,  titleKey: "candidateValue3Title", descKey: "candidateValue3Desc" },
  ];

  const corporateSteps = [
    { icon: Building2,    titleKey: "corporateStep1Title", descKey: "corporateStep1Desc" },
    { icon: FileText,     titleKey: "corporateStep2Title", descKey: "corporateStep2Desc" },
    { icon: Brain,        titleKey: "corporateStep3Title", descKey: "corporateStep3Desc" },
    { icon: BarChart3,    titleKey: "corporateStep4Title", descKey: "corporateStep4Desc" },
    { icon: CheckCircle2, titleKey: "corporateStep5Title", descKey: "corporateStep5Desc" },
    { icon: Award,        titleKey: "corporateStep6Title", descKey: "corporateStep6Desc" },
  ];

  const corporateValues = [
    { icon: TrendingUp, titleKey: "corporateValue1Title", descKey: "corporateValue1Desc" },
    { icon: Shield,     titleKey: "corporateValue2Title", descKey: "corporateValue2Desc" },
    { icon: Users,      titleKey: "corporateValue3Title", descKey: "corporateValue3Desc" },
  ];

  const architecture = [
    { icon: Code2,    titleKey: "arch1Title", descKey: "arch1Desc" },
    { icon: Database, titleKey: "arch2Title", descKey: "arch2Desc" },
    { icon: Globe,    titleKey: "arch3Title", descKey: "arch3Desc" },
  ];

  const roadmap = [
    { icon: Layers,   phaseKey: "phase1", titleKey: "phase1Title", descKey: "phase1Desc", status: "complete" },
    { icon: Target,   phaseKey: "phase2", titleKey: "phase2Title", descKey: "phase2Desc", status: "current"  },
    { icon: FileText, phaseKey: "phase3", titleKey: "phase3Title", descKey: "phase3Desc", status: "upcoming" },
    { icon: Mic,      phaseKey: "phase4", titleKey: "phase4Title", descKey: "phase4Desc", status: "upcoming" },
    { icon: Brain,    phaseKey: "phase5", titleKey: "phase5Title", descKey: "phase5Desc", status: "upcoming" },
  ];

  const futureFeatures = [
    { icon: Shield, titleKey: "future1Title", descKey: "future1Desc" },
    { icon: Rocket, titleKey: "future2Title", descKey: "future2Desc" },
    { icon: Globe,  titleKey: "future3Title", descKey: "future3Desc" },
    { icon: Brain,  titleKey: "future4Title", descKey: "future4Desc" },
  ];

  // ── CANDIDATE ──
  if (role === "candidate") {
    return (
      <div>
        {/* Hero */}
        <section className="relative overflow-hidden" aria-labelledby="about-heading">
          <div className="absolute inset-0 bg-hero-gradient opacity-[0.04]" />
          <div className="container py-16 md:py-24 relative text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 id="about-heading" className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                {language === "ar" ? (
                  <>
                    <span className="text-gradient">{t("about.about.candidateHeroTitleHighlight")}</span>{" "}
                    {t("about.about.candidateHeroTitle")}
                  </>
                ) : (
                  <>
                    {t("about.about.candidateHeroTitle")}
                    <span className="text-gradient">{t("about.about.candidateHeroTitleHighlight")}</span>
                  </>
                )}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("about.about.candidateHeroDesc")}
              </p>
            </motion.div>
          </div>
        </section>

        {/* How it works for candidates */}
        <section className="container py-16" aria-labelledby="how-heading">
          <h2 id="how-heading" className="text-2xl md:text-3xl font-bold mb-8 text-center">
            {t("about.about.howItWorksForYou")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {candidateSteps.map((s, i) => (
              <motion.div key={s.titleKey} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <Card className="h-full shadow-card hover:shadow-card-hover transition-all">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <s.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t(`about.about.${s.titleKey}`)}</h3>
                      <p className="text-sm text-muted-foreground">{t(`about.about.${s.descKey}`)}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Our Promise */}
        <section className="bg-secondary/30 py-16" aria-labelledby="values-heading">
          <div className="container">
            <h2 id="values-heading" className="text-2xl md:text-3xl font-bold mb-8 text-center">
              {t("about.about.ourPromise")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {candidateValues.map((v, i) => (
                <motion.div key={v.titleKey} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                  <Card className="h-full shadow-card text-center">
                    <CardContent className="p-6">
                      <v.icon className="h-10 w-10 text-primary mx-auto mb-3" />
                      <h3 className="font-semibold mb-1">{t(`about.about.${v.titleKey}`)}</h3>
                      <p className="text-sm text-muted-foreground">{t(`about.about.${v.descKey}`)}</p>
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

  // ── CORPORATE ──
  if (role === "corporate") {
    return (
      <div>
        {/* Hero */}
        <section className="relative overflow-hidden" aria-labelledby="about-heading">
          <div className="absolute inset-0 bg-hero-gradient opacity-[0.04]" />
          <div className="container py-16 md:py-24 relative text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 id="about-heading" className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                {language === "ar" ? (
                  <>
                    <span className="text-gradient">{t("about.about.corporateHeroTitleHighlight")}</span>{" "}
                    {t("about.about.corporateHeroTitle")}
                  </>
                ) : (
                  <>
                    {t("about.about.corporateHeroTitle")}
                    <span className="text-gradient">{t("about.about.corporateHeroTitleHighlight")}</span>
                  </>
                )}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("about.about.corporateHeroDesc")}
              </p>
            </motion.div>
          </div>
        </section>

        {/* How it works for employers */}
        <section className="container py-16" aria-labelledby="how-heading">
          <h2 id="how-heading" className="text-2xl md:text-3xl font-bold mb-8 text-center">
            {t("about.about.howItWorksForEmployers")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {corporateSteps.map((s, i) => (
              <motion.div key={s.titleKey} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <Card className="h-full shadow-card hover:shadow-card-hover transition-all">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <s.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t(`about.about.${s.titleKey}`)}</h3>
                      <p className="text-sm text-muted-foreground">{t(`about.about.${s.descKey}`)}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Why InclusiveHire */}
        <section className="bg-secondary/30 py-16" aria-labelledby="why-heading">
          <div className="container">
            <h2 id="why-heading" className="text-2xl md:text-3xl font-bold mb-8 text-center">
              {t("about.about.whyInclusiveHire")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {corporateValues.map((v, i) => (
                <motion.div key={v.titleKey} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                  <Card className="h-full shadow-card text-center">
                    <CardContent className="p-6">
                      <v.icon className="h-10 w-10 text-primary mx-auto mb-3" />
                      <h3 className="font-semibold mb-1">{t(`about.about.${v.titleKey}`)}</h3>
                      <p className="text-sm text-muted-foreground">{t(`about.about.${v.descKey}`)}</p>
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

  // ── GUEST ──
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden" aria-labelledby="about-heading">
        <div className="absolute inset-0 bg-hero-gradient opacity-[0.04]" />
        <div className="container py-16 md:py-24 relative text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 id="about-heading" className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              {t("about.about.guestHeroTitle")}
              <span className="text-gradient">InclusiveHire</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("about.about.guestHeroDesc")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* System Architecture */}
      <section className="container py-16" aria-labelledby="arch-heading">
        <h2 id="arch-heading" className="text-2xl md:text-3xl font-bold mb-8 text-center">
          {t("about.about.systemArchitecture")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {architecture.map((a, i) => (
            <motion.div key={a.titleKey} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <Card className="h-full shadow-card text-center">
                <CardContent className="p-6">
                  <a.icon className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-1">{t(`about.about.${a.titleKey}`)}</h3>
                  <p className="text-sm text-muted-foreground">{t(`about.about.${a.descKey}`)}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Development Roadmap */}
      <section className="bg-secondary/30 py-16" aria-labelledby="roadmap-heading">
        <div className="container">
          <h2 id="roadmap-heading" className="text-2xl md:text-3xl font-bold mb-8 text-center">
            {t("about.about.developmentRoadmap")}
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {roadmap.map((r, i) => (
              <motion.div key={r.phaseKey} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
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
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {language === "ar"
                            ? `المرحلة ${["١","٢","٣","٤","٥"][i]}`
                            : `Phase ${i + 1}`}
                        </span>
                        {r.status === "complete" && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            {t("about.about.complete")}
                          </span>
                        )}
                        {r.status === "current" && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                            {t("about.about.inProgress")}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold">{t(`about.about.${r.titleKey}`)}</h3>
                      <p className="text-sm text-muted-foreground">{t(`about.about.${r.descKey}`)}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Scalability */}
      <section className="container py-16" aria-labelledby="future-heading">
        <h2 id="future-heading" className="text-2xl md:text-3xl font-bold mb-8 text-center">
          {t("about.about.futureScalability")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {futureFeatures.map((f, i) => (
            <motion.div key={f.titleKey} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <Card className="h-full shadow-card hover:shadow-card-hover transition-all">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{t(`about.about.${f.titleKey}`)}</h3>
                    <p className="text-sm text-muted-foreground">{t(`about.about.${f.descKey}`)}</p>
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