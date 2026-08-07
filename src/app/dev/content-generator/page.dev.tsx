import { notFound } from "next/navigation";
import { ContentGeneratorTestClient } from "./ContentGeneratorTestClient";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export default function DevelopmentContentGeneratorPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <ContentGeneratorTestClient />;
}
