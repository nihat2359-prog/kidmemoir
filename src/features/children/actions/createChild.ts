"use server";

import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import {
  createChildSchema,
  type CreateChildInput,
} from "@/features/children/schemas/createChildSchema";
import { routing, type AppLocale } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

type CreateChildFailure = Readonly<{
  error: "database" | "unauthorized" | "validation";
  fieldErrors?: Partial<Record<keyof CreateChildInput, string>>;
  success: false;
}>;

export async function createChildAction(
  input: unknown,
  locale: AppLocale,
): Promise<CreateChildFailure> {
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
    ) as CreateChildFailure["fieldErrors"];
    return { error: "validation", fieldErrors, success: false };
  }

  const user = await getCurrentUser();
  if (!user) return { error: "unauthorized", success: false };

  const supabase = await createClient();
  const existingChild = await supabase
    .from("children")
    .select("id")
    .eq("user_id", user.id)
    .is("archived_at", null)
    .limit(1);

  if (existingChild.error) {
    console.error("First child eligibility check failed", existingChild.error);
    return { error: "database", success: false };
  }
  if (existingChild.data.length > 0) redirect(`/${locale}/dashboard`);

  const { error } = await supabase.from("children").insert({
    birth_date: result.data.birthDate,
    birth_height: result.data.birthHeight ?? null,
    birth_place: result.data.birthPlace ?? null,
    birth_weight: result.data.birthWeight ?? null,
    first_name: result.data.firstName,
    gender: result.data.gender,
    is_default: true,
    last_name: result.data.lastName ?? null,
    notes: result.data.notes ?? null,
    user_id: user.id,
  });

  if (error) {
    console.error("First child creation failed", error);
    return { error: "database", success: false };
  }

  redirect(`/${locale}/dashboard`);
}
