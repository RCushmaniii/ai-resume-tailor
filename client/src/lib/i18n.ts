import i18n, { type i18n as I18nInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import { en } from "@/i18n/en";
import { es } from "@/i18n/es";

export type SupportedLanguage = "en" | "es";

const LANGUAGE_STORAGE_KEY = "ai_resume_tailor_language";

function normalizeLanguage(input: string): SupportedLanguage {
  const lower = input.toLowerCase();
  if (lower.startsWith("es")) return "es";
  return "en";
}

function getInitialLanguage(): SupportedLanguage {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored) return normalizeLanguage(stored);
  } catch {
    // ignore
  }

  if (typeof navigator !== "undefined") {
    return normalizeLanguage(navigator.language || "en");
  }

  return "en";
}

let initialized = false;

export function initI18n(): I18nInstance {
  if (initialized) return i18n;

  i18n
    .use(initReactI18next)
    .init({
      lng: getInitialLanguage(),
      fallbackLng: "en",
      interpolation: { escapeValue: false },
      resources: {
        en: { translation: en },
        es: { translation: es },
      },
    });

  initialized = true;
  return i18n;
}

export async function setLanguage(language: SupportedLanguage): Promise<void> {
  await i18n.changeLanguage(language);
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // ignore
  }
}

export function getLanguage(): SupportedLanguage {
  return normalizeLanguage(i18n.language || "en");
}