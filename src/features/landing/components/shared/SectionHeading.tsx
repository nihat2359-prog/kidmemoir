import { Badge } from "@/components/ui/Badge";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";

type SectionHeadingProps = Readonly<{
  align?: "center" | "left";
  description?: string;
  eyebrow: string;
  title: string;
}>;

export function SectionHeading({
  align = "left",
  description,
  eyebrow,
  title,
}: SectionHeadingProps) {
  return (
    <div
      className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}
    >
      <Badge variant="primary">{eyebrow}</Badge>
      <Typography className="mt-4 text-balance" variant="h2">
        {title}
      </Typography>
      {description ? (
        <Typography
          className="text-muted-foreground mt-4 text-pretty"
          variant="bodyLarge"
        >
          {description}
        </Typography>
      ) : null}
    </div>
  );
}
