import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";

type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
  translations: typeof en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language | null;
    if (savedLanguage === "en" || savedLanguage === "ar") {
      setLanguage(savedLanguage);
      applyLanguage(savedLanguage);
    }
  }, []);

  // Apply language changes (RTL for Arabic)
  const applyLanguage = (lang: Language) => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    localStorage.setItem("language", lang);
  };

  const toggleLanguage = () => {
    const newLanguage: Language = language === "en" ? "ar" : "en";
    setLanguage(newLanguage);
    applyLanguage(newLanguage);
  };

  // Translation function with dot notation support
  const t = (key: string): string => {
    const translations = language === "ar" ? ar : en;
    const keys = key.split(".");
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    // Handle {year} placeholder
    if (typeof value === "string") {
      return value.replace("{year}", new Date().getFullYear().toString());
    }

    return String(value);
  };

  const translations = language === "ar" ? ar : en;

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
