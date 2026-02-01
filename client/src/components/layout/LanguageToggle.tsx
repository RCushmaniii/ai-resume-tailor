import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { setLanguage, type SupportedLanguage } from "@/lib/i18n";
import { Globe } from "lucide-react";

type LanguageToggleProps = {
  variant?: "ghost" | "outline";
};

export function LanguageToggle({ variant = "ghost" }: LanguageToggleProps) {
  const { t, i18n } = useTranslation();

  const current = useMemo(() => {
    const lang = (i18n.language || "en").toLowerCase();
    return lang.startsWith("es") ? ("es" satisfies SupportedLanguage) : ("en" satisfies SupportedLanguage);
  }, [i18n.language]);

  const toggleLanguage = () => {
    setLanguage(current === "en" ? "es" : "en");
  };

  // Show the OTHER language name as the toggle option
  const targetLanguageLabel = current === "en" ? "Español" : "English";

  return (
    <Button
      type="button"
      variant={variant}
      onClick={toggleLanguage}
      className="flex items-center gap-2 text-sm font-medium"
      aria-label={t("language.toggleLabel")}
    >
      <Globe className="h-4 w-4" />
      <span>{targetLanguageLabel}</span>
    </Button>
  );
}
