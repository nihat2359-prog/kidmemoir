export type MemoryEntryType = "memory" | "photo" | "video" | "audio";

export type MemoryCatalogItem = Readonly<{
  categoryId: string;
  id: string;
  name: string;
}>;

export type MemoryCategory = Readonly<{
  id: string;
  name: string;
  subCategories: readonly MemoryCatalogItem[];
}>;

export type CreateMemoryContext = Readonly<{
  categories: readonly MemoryCategory[];
  child: Readonly<{ firstName: string; id: string }>;
}>;

export type ExistingMemoryMedia = Readonly<{
  type: Exclude<MemoryEntryType, "memory">;
  url: string;
}>;
