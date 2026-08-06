import { BookHeart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Link } from "@/i18n/navigation";
export function TimelineEmptyState({
  action,
  description,
  title,
}: {
  action: string;
  description: string;
  title: string;
}) {
  return (
    <EmptyState
      action={
        <Button asChild size="lg">
          <Link href="/memories/new">{action}</Link>
        </Button>
      }
      className="min-h-[28rem] rounded-[2.5rem]"
      description={description}
      icon={<BookHeart aria-hidden className="size-6" />}
      title={title}
    />
  );
}
