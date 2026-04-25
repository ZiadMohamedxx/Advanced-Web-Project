import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import AccessibilityButton from "@/components/AccessibilityButton";
import AccessibilityPanel from "@/components/AccessibilityPanel";

export default function Layout() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md"
      >
        {t ? t("common.back") : "Skip to main content"}
      </a>

      <Navbar />

      <main id="main-content" className="flex-1" role="main">
        <Outlet />
      </main>

      <Footer />

      <AccessibilityButton />
      <AccessibilityPanel />
    </div>
  );
}