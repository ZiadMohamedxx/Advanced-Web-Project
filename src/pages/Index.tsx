import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Users, Briefcase, Brain, Eye, Mic, FileText,
  ArrowRight, CheckCircle2, Sparkles, Shield, Heart
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Index() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Users,
      titleKey: "index.candidatePortalTitle",
      descKey: "index.candidatePortalDesc",
      to: "/candidate-portal",
    },
    {
      icon: Briefcase,
      titleKey: "index.employerPortalTitle",
      descKey: "index.employerPortalDesc",
      to: "/employer-portal",
    },
    {
      icon: Brain,
      titleKey: "index.aiMatchingTitle",
      descKey: "index.aiMatchingDesc",
      to: "/jobs",
    },
    {
      icon: FileText,
      titleKey: "index.cvAnalyzerTitle",
      descKey: "index.cvAnalyzerDesc",
      to: "/candidate-portal",
    },
    {
      icon: Mic,
      titleKey: "index.speechApisTitle",
      descKey: "index.speechApisDesc",
      to: "/accessibility",
    },
    {
      icon: Eye,
      titleKey: "index.accessibilityFirstTitle",
      descKey: "index.accessibilityFirstDesc",
      to: "/accessibility",
    },
  ];

  const steps = [
    { num: "01", titleKey: "index.step1Title", descKey: "index.step1Desc" },
    { num: "02", titleKey: "index.step2Title", descKey: "index.step2Desc" },
    { num: "03", titleKey: "index.step3Title", descKey: "index.step3Desc" },
    { num: "04", titleKey: "index.step4Title", descKey: "index.step4Desc" },
  ];

  const stats = [
    { valueKey: "index.stat1Value", labelKey: "index.stat1" },
    { valueKey: "index.stat2Value", labelKey: "index.stat2" },
    { valueKey: "index.stat3Value", labelKey: "index.stat3" },
  ];

  const values = [
    {
      icon: Heart,
      titleKey: "index.inclusion",
      descKey: "index.inclusionDesc",
    },
    {
      icon: Shield,
      titleKey: "index.privacy",
      descKey: "index.privacyDesc",
    },
    {
      icon: CheckCircle2,
      titleKey: "index.abilityFirst",
      descKey: "index.abilityFirstDesc",
    },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
    }),
  };

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
                {t("index.aiPowered")}
              </span>
              <h1 id="hero-heading" className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
                {t("index.heroTitle")}{" "}
                <span className="text-gradient">{t("index.heroTitleHighlight")}</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                {t("index.heroDescription")}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/signup">
                  <Button size="lg" className="gap-2 w-full sm:w-auto">
                    {t("index.getStarted")} <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/employer-portal">
                  <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                    <Briefcase className="h-4 w-4" /> {t("index.exploreJobs")}
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
                <p className="text-3xl md:text-4xl font-bold text-gradient">{t(stat.valueKey)}</p>
                <p className="text-sm text-muted-foreground mt-1">{t(stat.labelKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20" aria-labelledby="features-heading">
        <div className="text-center mb-14">
          <h2 id="features-heading" className="text-3xl md:text-4xl font-bold mb-4">
            {t("index.platformFeatures")}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("index.platformFeaturesDesc")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.titleKey}
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
                <h3 className="font-semibold text-lg mb-2">{t(f.titleKey)}</h3>
                <p className="text-sm text-muted-foreground">{t(f.descKey)}</p>
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
              {t("index.howItWorks")}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t("index.gettingStartedDesc")}
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
                <h3 className="font-semibold mt-2 mb-2">{t(step.titleKey)}</h3>
                <p className="text-sm text-muted-foreground">{t(step.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container py-20" aria-labelledby="values-heading">
        <div className="max-w-3xl mx-auto text-center">
          <h2 id="values-heading" className="text-3xl md:text-4xl font-bold mb-10">
            {t("index.coreValues")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.titleKey}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="p-6 rounded-xl border bg-card"
              >
                <v.icon className="h-8 w-8 text-accent mx-auto mb-3" aria-hidden="true" />
                <h3 className="font-semibold mb-1">{t(v.titleKey)}</h3>
                <p className="text-sm text-muted-foreground">{t(v.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-hero-gradient py-20" aria-labelledby="cta-heading">
        <div className="container text-center">
          <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            {t("index.ctaTitle")}
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
            {t("index.ctaDesc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/candidate-portal">
              <Button size="lg" variant="secondary" className="gap-2">
                {t("index.joinAsCandidate")} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/employer-portal">
              <Button size="lg" variant="outline" className="gap-2 border-primary-foreground/30 text-black hover:bg-primary-foreground/10">
                {t("index.joinAsEmployer")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}