import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Eye, Keyboard, Mic, Subtitles, Contrast, ScanSearch,
  Volume2, Hand, Monitor, Accessibility
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const fadeUp = {
  hidden:  { opacity: 0, y: 20 } as const,
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
} as const;

export default function AccessibilityPage() {
  const { t, language } = useLanguage();

  const features = [
    { icon: Contrast,   titleKey: "feature1Title", descKey: "feature1Desc" },
    { icon: ScanSearch, titleKey: "feature2Title", descKey: "feature2Desc" },
    { icon: Keyboard,   titleKey: "feature3Title", descKey: "feature3Desc" },
    { icon: Mic,        titleKey: "feature4Title", descKey: "feature4Desc" },
    { icon: Subtitles,  titleKey: "feature5Title", descKey: "feature5Desc" },
    { icon: Volume2,    titleKey: "feature6Title", descKey: "feature6Desc" },
    { icon: Hand,       titleKey: "feature7Title", descKey: "feature7Desc" },
    { icon: Monitor,    titleKey: "feature8Title", descKey: "feature8Desc" },
  ];

  const standards = [
    "standard1", "standard2", "standard3",
    "standard4", "standard5", "standard6",
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden" aria-labelledby="a11y-heading">
        <div className="absolute inset-0 bg-hero-gradient opacity-[0.04]" />
        <div className="container py-16 md:py-24 relative text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Accessibility className="h-8 w-8 text-primary" />
            </div>
            <h1 id="a11y-heading" className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              {language === "ar" ? (
                <>
                  {t("accessibilityPage.heroTitle")}{" "}
                  <span className="text-gradient">{t("accessibilityPage.heroTitleHighlight")}</span>
                </>
              ) : (
                <>
                  <span className="text-gradient">{t("accessibilityPage.heroTitleHighlight")}</span>{" "}
                  {t("accessibilityPage.heroTitle")}
                </>
              )}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("accessibilityPage.heroDesc")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container py-16" aria-labelledby="a11y-features-heading">
        <h2 id="a11y-features-heading" className="text-2xl md:text-3xl font-bold mb-8 text-center">
          {t("accessibilityPage.builtInFeatures")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.titleKey}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <Card className="h-full shadow-card hover:shadow-card-hover transition-all text-center">
                <CardHeader className="pb-2">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <f.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-base">
                    {t(`accessibilityPage.${f.titleKey}`)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {t(`accessibilityPage.${f.descKey}`)}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Standards */}
      <section className="bg-secondary/30 py-16" aria-labelledby="standards-heading">
        <div className="container text-center">
          <h2 id="standards-heading" className="text-2xl md:text-3xl font-bold mb-8">
            {t("accessibilityPage.complianceTitle")}
          </h2>
          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
            {standards.map((key, i) => (
              <motion.span
                key={key}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="px-4 py-2 rounded-full bg-card border shadow-card text-sm font-medium flex items-center gap-2"
              >
                <Eye className="h-4 w-4 text-primary" />
                {t(`accessibilityPage.${key}`)}
              </motion.span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}