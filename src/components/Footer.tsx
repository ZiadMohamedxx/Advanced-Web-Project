import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Accessibility } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const guestLinksConfig = [
  {
    titleKey: "footer.platform",
    links: [
      { labelKey: "footer.findJobs",        to: "/jobs" },
      { labelKey: "footer.candidatePortal", to: "/candidate-portal" },
      { labelKey: "footer.employerPortal",  to: "/employer-portal" },
    ],
  },
  {
    titleKey: "footer.resources",
    links: [
      { labelKey: "footer.accessibilityLink", to: "/accessibility" },
      { labelKey: "footer.aboutUs",      to: "/about" },
      { labelKey: "footer.aiFeatures",   to: "/about" },
    ],
  },
  {
    titleKey: "footer.support",
    links: [
      { labelKey: "footer.helpCenter",    to: "/" },
      { labelKey: "footer.contactUs",     to: "/" },
      { labelKey: "footer.privacyPolicy", to: "/" },
    ],
  },
];

const candidateFooterLinksConfig = [
  {
    titleKey: "footer.mySpace",
    links: [
      { labelKey: "footer.findJobs",       to: "/jobs" },
      { labelKey: "footer.myProfile", to: "/candidate-portal" },
    ],
  },
  {
    titleKey: "footer.resources",
    links: [
      { labelKey: "footer.aboutUs", to: "/about" },
    ],
  },
];

const corporateFooterLinksConfig = [
  {
    titleKey: "footer.mySpace",
    links: [
      { labelKey: "footer.employerPortal",         to: "/employer-portal" },
      { labelKey: "footer.postAJob",   to: "/post-job" },
      { labelKey: "footer.myDashboard", to: "/employer-dashboard" },
    ],
  },
  {
    titleKey: "footer.resources",
    links: [
      { labelKey: "footer.aboutUs", to: "/about" },
    ],
  },
];

export default function Footer() {
  const [role, setRole] = useState<"candidate" | "corporate" | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setRole(parsed.role === "corporate" ? "corporate" : parsed.role === "candidate" ? "candidate" : null);
    }
  }, []);

  const footerLinksConfig =
    role === "candidate" ? candidateFooterLinksConfig :
    role === "corporate" ? corporateFooterLinksConfig :
    guestLinksConfig;

  const footerLinks = footerLinksConfig.map(section => ({
    title: t(section.titleKey),
    links: section.links.map(link => ({
      label: t(link.labelKey),
      to: link.to
    }))
  }));

  return (
    <footer className="border-t bg-secondary/50" role="contentinfo">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 font-bold text-lg mb-3">
              <Accessibility className="h-6 w-6 text-primary" aria-hidden="true" />
              <span className="text-gradient">InclusiveHire</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {t("footer.tagline")}
            </p>
          </div>
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t text-center text-sm text-muted-foreground">
          {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
}