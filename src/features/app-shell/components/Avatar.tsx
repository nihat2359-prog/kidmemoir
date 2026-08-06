import { UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

type AvatarProps = Readonly<{
  className?: string;
  imageUrl?: string | null;
  label: string;
  name: string;
}>;

export function Avatar({ className, imageUrl, label, name }: AvatarProps) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase())
    .join("");

  return (
    <span
      aria-label={label}
      className={cn(
        "from-primary/20 to-ai/20 text-primary relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br font-semibold ring-1 ring-black/5 dark:ring-white/10",
        className,
      )}
      role="img"
    >
      {imageUrl ? (
        // Storage URLs are short-lived, authenticated Supabase signed URLs.
        // eslint-disable-next-line @next/next/no-img-element
        <img alt="" className="size-full object-cover" src={imageUrl} />
      ) : initials ? (
        <span aria-hidden>{initials}</span>
      ) : (
        <UserRound aria-hidden className="size-1/2" />
      )}
    </span>
  );
}
