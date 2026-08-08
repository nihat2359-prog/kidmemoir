"use client";

import { useState } from "react";
import { Heart, Pencil, Share2, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { deleteMemoryAction } from "@/features/memories/actions/deleteMemory";
import { TimelineMediaPreview } from "@/features/timeline/components/TimelineMediaPreview";
import { toggleMemoryFavorite } from "@/features/events/actions";
import type { EventListItem } from "@/features/events/types";
import { Link, useRouter } from "@/i18n/navigation";
import { analytics } from "@/lib/analytics";

export function EventCard({
  item,
  locale,
}: {
  item: EventListItem;
  locale: "tr" | "en";
}) {
  const t = useTranslations("events.card");
  const router = useRouter();
  const [favorite, setFavorite] = useState(item.isFavorite);
  const [busy, setBusy] = useState(false);
  async function toggle() {
    setBusy(true);
    const r = await toggleMemoryFavorite(item.id);
    if (r.success) {
      setFavorite(r.favorite);
      analytics.track("memory_favorited", { favorite: r.favorite });
      router.refresh();
    }
    setBusy(false);
  }
  async function remove() {
    if (!confirm(t("deleteConfirm"))) return;
    setBusy(true);
    const r = await deleteMemoryAction(item.id, item.childId);
    if (r.success) {
      analytics.track("memory_deleted");
      router.refresh();
    }
    setBusy(false);
  }
  async function share() {
    const url = `${location.origin}/${locale}/memories/${item.id}`;
    if (navigator.share) await navigator.share({ title: item.title, url });
    else await navigator.clipboard.writeText(url);
  }
  return (
    <article className="bg-card/75 overflow-hidden rounded-[2rem] border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none sm:p-6">
      <Link
        href={`/memories/${item.id}`}
        aria-label={t("open", { title: item.title })}
      >
        <TimelineMediaPreview
          label={t("media", { title: item.title })}
          media={item.media}
        />
        <h2 className="mt-5 text-xl font-semibold">{item.title}</h2>
      </Link>
      <div className="text-muted-foreground mt-3 flex flex-wrap gap-2 text-xs">
        <span>{item.childName}</span>
        <span>•</span>
        <span>{item.category}</span>
        <span>•</span>
        <time>
          {new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
            new Date(item.occurredAt),
          )}
        </time>
      </div>
      {item.description && (
        <p className="text-muted-foreground mt-3 line-clamp-3 text-sm leading-6">
          {item.description}
        </p>
      )}
      <div className="mt-5 flex flex-wrap gap-2 border-t pt-4">
        <Button
          aria-label={favorite ? t("unfavorite") : t("favorite")}
          disabled={busy}
          icon={<Heart aria-hidden fill={favorite ? "currentColor" : "none"} />}
          onClick={() => void toggle()}
          size="sm"
          variant="ghost"
        />
        <Button asChild icon={<Pencil aria-hidden />} size="sm" variant="ghost">
          <Link href={`/memories/${item.id}/edit`}>{t("edit")}</Link>
        </Button>
        <Button
          icon={<Share2 aria-hidden />}
          onClick={() => void share()}
          size="sm"
          variant="ghost"
        >
          {t("share")}
        </Button>
        <Button
          className="ml-auto"
          disabled={busy}
          icon={<Trash2 aria-hidden />}
          onClick={() => void remove()}
          size="sm"
          variant="danger"
        >
          {t("delete")}
        </Button>
      </div>
    </article>
  );
}
