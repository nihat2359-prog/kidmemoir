import { Apple, Globe2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function SocialLoginPlaceholders() {
  const t = useTranslations("auth.login");

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Button
        aria-label={`${t("googleLogin")} · ${t("comingSoon")}`}
        className="bg-background/55 relative rounded-lg"
        disabled
        fullWidth
        size="lg"
        variant="outline"
      >
        <Globe2 aria-hidden />
        {t("googleLogin")}
        <Badge className="absolute -top-2 -right-2" variant="neutral">
          {t("comingSoon")}
        </Badge>
      </Button>
      <Button
        aria-label={`${t("appleLogin")} · ${t("comingSoon")}`}
        className="bg-background/55 relative rounded-lg"
        disabled
        fullWidth
        size="lg"
        variant="outline"
      >
        <Apple aria-hidden />
        {t("appleLogin")}
      </Button>
    </div>
  );
}
