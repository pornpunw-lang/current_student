/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "th" | "en";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (th: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangInternal] = useState<Language>(() => {
    const saved = localStorage.getItem("bu_survey_lang");
    return (saved as Language) || "th";
  });

  const setLang = (newLang: Language) => {
    setLangInternal(newLang);
    localStorage.setItem("bu_survey_lang", newLang);
  };

  const t = (th: string, en: string) => {
    return lang === "th" ? th : en;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
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
