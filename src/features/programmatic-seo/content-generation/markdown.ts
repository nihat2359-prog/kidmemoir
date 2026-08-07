import type { GeneratedHeroGuide } from "@/features/programmatic-seo/hero-generator/types";

const LABELS = {
  en: {
    checklist: "Checklist",
    commonMistakes: "Common mistakes",
    comparison: "Comparison",
    faq: "Frequently asked questions",
    letters: "Letters",
    memoryIdeas: "Memory ideas",
    photoIdeas: "Photo ideas",
    questions: "Questions to ask",
    timeline: "Timeline",
    videoIdeas: "Video ideas",
  },
  tr: {
    checklist: "Kontrol listesi",
    commonMistakes: "Yaygın hatalar",
    comparison: "Karşılaştırma",
    faq: "Sık sorulan sorular",
    letters: "Mektuplar",
    memoryIdeas: "Anı fikirleri",
    photoIdeas: "Fotoğraf fikirleri",
    questions: "Sorulacak sorular",
    timeline: "Zaman çizelgesi",
    videoIdeas: "Video fikirleri",
  },
} as const;

const bullets = (items: readonly string[]) =>
  items.map((item) => `- ${item}`).join("\n");

export function renderContentMarkdown(
  guide: GeneratedHeroGuide,
  locale: "tr" | "en",
): string {
  const labels = LABELS[locale];
  const comparison = [
    `| ${guide.comparison.columns.join(" | ")} |`,
    `| ${guide.comparison.columns.map(() => "---").join(" | ")} |`,
    ...guide.comparison.rows.map((row) => `| ${row.join(" | ")} |`),
  ];
  return [
    `# ${guide.hero.title}`,
    guide.hero.description,
    `> ${guide.quickAnswer}`,
    ...guide.introduction,
    ...guide.sections.flatMap((section) => [
      `## ${section.heading}`,
      ...section.body,
    ]),
    `## ${labels.timeline}`,
    ...guide.timeline.map((item) => `### ${item.label}\n\n${item.description}`),
    `## ${labels.checklist}`,
    bullets(guide.checklist.map((item) => `[ ] ${item}`)),
    `## ${labels.memoryIdeas}`,
    bullets(guide.memoryIdeas),
    `## ${labels.photoIdeas}`,
    bullets(guide.photoIdeas),
    `## ${labels.videoIdeas}`,
    bullets(guide.videoIdeas),
    `## ${labels.letters}`,
    bullets(guide.letters),
    `## ${labels.questions}`,
    bullets(guide.questions),
    `## ${labels.comparison}`,
    ...comparison,
    `## ${labels.commonMistakes}`,
    ...guide.commonMistakes.map(
      (item) => `### ${item.mistake}\n\n${item.correction}`,
    ),
    `## ${labels.faq}`,
    ...guide.faq.flatMap((item) => [`### ${item.question}`, item.answer]),
    ...guide.conclusion,
    `## ${guide.cta.title}`,
    guide.cta.description,
    `**${guide.cta.label}**`,
  ].join("\n\n");
}
