import type { MemoryInsight } from "@/features/ai/types/ai.types";

type MemoryContext = Readonly<{
  description: string | null;
  mood: string | null;
  tags: string[];
  title: string;
}>;

const emotionByMood: Record<string, MemoryInsight["emotion"]> = {
  disappointed: "sadness",
  excitement: "joy",
  fear: "fear",
  happy: "joy",
  neutral: "neutral",
  proud: "pride",
  sad: "sadness",
};

const categoryRules: ReadonlyArray<readonly [string, readonly string[]]> = [
  ["firsts", ["ilk", "first"]],
  ["school", ["okul", "school", "sınıf", "class"]],
  ["sports", ["spor", "sport", "futbol", "football", "bisiklet", "bike"]],
  ["music", ["müzik", "music", "şarkı", "song", "piyano", "piano"]],
  ["travel", ["tatil", "travel", "seyahat", "holiday", "deniz", "sea"]],
  ["friends", ["arkadaş", "friend"]],
  ["creativity", ["resim", "drawing", "paint", "çizim"]],
  ["language", ["kelime", "word", "konuş", "speak"]],
];

export function deriveRuleBasedMemoryInsight(
  memory: MemoryContext,
): MemoryInsight | null {
  const source = [memory.title, memory.description, ...memory.tags]
    .filter(Boolean)
    .join(" ")
    .normalize("NFKC")
    .toLocaleLowerCase();
  const categories = categoryRules
    .filter(([, keywords]) =>
      keywords.some((keyword) => source.includes(keyword)),
    )
    .map(([category]) => category)
    .slice(0, 3);
  const emotion = memory.mood ? emotionByMood[memory.mood] : undefined;
  if (!emotion || !categories.length || (memory.description?.length ?? 0) > 180)
    return null;
  const keywords = [
    ...new Set(memory.tags.map((tag) => tag.trim()).filter(Boolean)),
  ].slice(0, 5);
  return {
    developmentCategories: categories,
    emotion,
    keywords,
    shortTitle: memory.title.slice(0, 80),
    summary: (memory.description?.trim() || memory.title).slice(0, 240),
  };
}
