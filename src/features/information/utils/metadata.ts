import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";

export function informationMetadata({
  description,
  locale,
  path,
  title,
}: {
  description: string;
  locale: AppLocale;
  path: string;
  title: string;
}): Metadata {
  return buildMetadata({
    description,
    locale,
    path,
    title,
  });
}
