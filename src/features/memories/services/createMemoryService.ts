import "server-only";

import type { User } from "@supabase/supabase-js";
import type { CreateMemoryContext } from "@/features/memories/types/createMemory.types";
import { createClient } from "@/lib/supabase/server";

export async function getCreateMemoryContext(
  user: User,
): Promise<CreateMemoryContext | null> {
  const supabase = await createClient();
  const [childResult, categoriesResult, subCategoriesResult] =
    await Promise.all([
      supabase
        .from("children")
        .select("id,first_name")
        .eq("user_id", user.id)
        .is("archived_at", null)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("event_categories")
        .select("id,name")
        .eq("is_active", true)
        .order("sort_order"),
      supabase
        .from("event_sub_categories")
        .select("id,category_id,name")
        .order("sort_order"),
    ]);

  if (
    childResult.error ||
    categoriesResult.error ||
    subCategoriesResult.error
  ) {
    throw new Error("Create memory context could not be loaded", {
      cause:
        childResult.error ??
        categoriesResult.error ??
        subCategoriesResult.error,
    });
  }
  if (!childResult.data) return null;

  return {
    categories: (categoriesResult.data ?? []).map((category) => ({
      id: category.id,
      name: category.name,
      subCategories: (subCategoriesResult.data ?? [])
        .filter((item) => item.category_id === category.id)
        .map((item) => ({
          categoryId: item.category_id,
          id: item.id,
          name: item.name,
        })),
    })),
    child: { firstName: childResult.data.first_name, id: childResult.data.id },
  };
}
