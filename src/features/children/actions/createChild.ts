"use server";

import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import {
  createChildSchema,
  type CreateChildInput,
} from "@/features/children/schemas/createChildSchema";
import { routing, type AppLocale } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { getAccountPlan } from "@/features/account/services/accountService";

type CreateChildResult =
  | Readonly<{
      destination: "/children" | "/dashboard";
      success: true;
    }>
  | Readonly<{
      error: "database" | "premiumRequired" | "unauthorized" | "validation";
      fieldErrors?: Partial<Record<keyof CreateChildInput, string>>;
      success: false;
    }>;

export async function createChildAction(
  input: unknown,
  locale: AppLocale,
): Promise<CreateChildResult> {
  if (!hasLocale(routing.locales, locale)) {
    return { error: "validation", success: false };
  }

  const t = await getTranslations({
    locale,
    namespace: "children.create.validation",
  });
  const result = createChildSchema({
    birthDateFuture: t("birthDateFuture"),
    birthDateInvalid: t("birthDateInvalid"),
    birthDateRequired: t("birthDateRequired"),
    birthHeightPositive: t("birthHeightPositive"),
    birthPlaceMaxLength: t("birthPlaceMaxLength"),
    birthWeightPositive: t("birthWeightPositive"),
    firstNameMaxLength: t("firstNameMaxLength"),
    firstNameRequired: t("firstNameRequired"),
    genderRequired: t("genderRequired"),
    lastNameMaxLength: t("lastNameMaxLength"),
    notesMaxLength: t("notesMaxLength"),
  }).safeParse(input);

  if (!result.success) {
    const flattened = result.error.flatten().fieldErrors;
    const fieldErrors = Object.fromEntries(
      Object.entries(flattened)
        .filter((entry): entry is [string, string[]] => Boolean(entry[1]?.[0]))
        .map(([field, messages]) => [field, messages[0]]),
    ) as Extract<CreateChildResult, { success: false }>["fieldErrors"];
    return { error: "validation", fieldErrors, success: false };
  }

  const user = await getCurrentUser();
  if (!user) return { error: "unauthorized", success: false };

  const supabase = await createClient();
  const [existingChild, plan] = await Promise.all([
    supabase
      .from("children")
      .select("id")
      .eq("user_id", user.id)
      .is("archived_at", null)
      .limit(1),
    getAccountPlan(user),
  ]);

  if (existingChild.error) {
    console.error("First child eligibility check failed", existingChild.error);
    return { error: "database", success: false };
  }
  if (existingChild.data.length > 0 && plan === "free")
    return { error: "premiumRequired", success: false };
  const { error } = await supabase.from("children").insert({
    birth_date: result.data.birthDate,
    birth_height: result.data.birthHeight ?? null,
    birth_place: result.data.birthPlace ?? null,
    birth_weight: result.data.birthWeight ?? null,
    first_name: result.data.firstName,
    gender: result.data.gender,
    is_default: existingChild.data.length === 0,
    last_name: result.data.lastName ?? null,
    notes: result.data.notes ?? null,
    user_id: user.id,
  });

  if (error) {
    console.error("First child creation failed", error);
    return { error: "database", success: false };
  }

  return {
    destination: existingChild.data.length === 0 ? "/dashboard" : "/children",
    success: true,
  };
}
