import type { RelatedSeoPage } from "@/features/programmatic-seo/types/content";

export type RelatedContentGroups = Readonly<{
  checklists: readonly RelatedSeoPage[];
  faqs: readonly RelatedSeoPage[];
  guides: readonly RelatedSeoPage[];
  memoryIdeas: readonly RelatedSeoPage[];
  milestones: readonly RelatedSeoPage[];
  other: readonly RelatedSeoPage[];
}>;

export function groupRelatedContent(
  pages: readonly RelatedSeoPage[],
): RelatedContentGroups {
  return {
    checklists: pages.filter(({ category }) => category === "checklists"),
    faqs: pages.filter(({ category }) => category === "questions"),
    guides: pages.filter(({ category }) => category === "guides"),
    memoryIdeas: pages.filter(({ category }) => category === "memory-ideas"),
    milestones: pages.filter(({ category }) => category === "milestones"),
    other: pages.filter(
      ({ category }) =>
        ![
          "checklists",
          "questions",
          "guides",
          "memory-ideas",
          "milestones",
        ].includes(category),
    ),
  };
}
