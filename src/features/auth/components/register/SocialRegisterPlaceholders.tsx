import { Apple, Globe2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function SocialRegisterPlaceholders() {
  const t = useTranslations("auth.register");

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Button
        aria-label={t("googleRegisterAriaLabel")}
        className="bg-background/55 relative rounded-lg"
        disabled
        fullWidth
        size="lg"
        variant="outline"
      >
        <Globe2 aria-hidden />
        {t("googleRegister")}
        <Badge className="absolute -top-2 -right-2" variant="neutral">
          {t("comingSoon")}
        </Badge>
      </Button>
      <Button
        aria-label={t("appleRegisterAriaLabel")}
        className="bg-background/55 relative rounded-lg"
        disabled
        fullWidth
        size="lg"
        variant="outline"
      >
        <Apple aria-hidden />
        {t("appleRegister")}
      </Button>
    </div>
  );
}
