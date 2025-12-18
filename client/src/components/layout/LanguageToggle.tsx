import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { setLanguage, type SupportedLanguage } from "@/lib/i18n";

type LanguageToggleProps = {
  variant?: "ghost" | "outline";
};

export function LanguageToggle({ variant = "ghost" }: LanguageToggleProps) {
  const { t, i18n } = useTranslation();

  const current = useMemo(() => {
    const lang = (i18n.language || "en").toLowerCase();
    return lang.startsWith("es") ? ("es" satisfies SupportedLanguage) : ("en" satisfies SupportedLanguage);
  }, [i18n.language]);

  return (
    <div className="inline-flex items-center gap-1" role="group" aria-label={t("language.toggleLabel")}>
      <Button
        type="button"
        variant={variant}
        className={current === "en" ? "font-semibold" : "opacity-70"}
        onClick={() => setLanguage("en")}
      >
        EN
      </Button>
      <Button
        type="button"
        variant={variant}
        className={current === "es" ? "font-semibold" : "opacity-70"}
        onClick={() => setLanguage("es")}
      >
        ES
      </Button>
    </div>
  );
}
