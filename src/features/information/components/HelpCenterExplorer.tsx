"use client";

import type { LucideIcon } from "lucide-react";
import { useDeferredValue, useId, useState } from "react";
import {
  Bot,
  Camera,
  CircleUserRound,
  CreditCard,
  Library,
  Search,
  Sparkles,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";

export type HelpCategory = Readonly<{
  description: string;
  key: "account" | "ai" | "memories" | "media" | "premium" | "usage";
  title: string;
}>;

export type HelpQuestion = Readonly<{
  answer: string;
  category: HelpCategory["key"];
  id: string;
  question: string;
}>;

const icons: Record<HelpCategory["key"], LucideIcon> = {
  account: CircleUserRound,
  ai: Bot,
  memories: Library,
  media: Camera,
  premium: CreditCard,
  usage: Sparkles,
};

export function HelpCenterExplorer({
  categories,
  labels,
  questions,
}: {
  categories: readonly HelpCategory[];
  labels: Readonly<{
    categories: string;
    empty: string;
    faq: string;
    search: string;
    searchLabel: string;
    soon: string;
  }>;
  questions: readonly HelpQuestion[];
}) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase());
  const searchId = useId();
  const filtered = deferredQuery
    ? questions.filter(({ answer, question }) =>
        `${question} ${answer}`.toLocaleLowerCase().includes(deferredQuery),
      )
    : questions;

  return (
    <div className="space-y-12 pb-10">
      <section
        aria-labelledby={searchId}
        className="bg-card/80 rounded-[2rem] border p-5 shadow-sm backdrop-blur-sm sm:p-8"
      >
        <label className="text-lg font-semibold" htmlFor={searchId}>
          {labels.searchLabel}
        </label>
        <div className="relative mt-4">
          <Search
            aria-hidden
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 z-10 size-5 -translate-y-1/2"
          />
          <Input
            className="h-14 rounded-2xl pr-4 pl-12 text-base"
            id={searchId}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={labels.search}
            type="search"
            value={query}
          />
        </div>
      </section>

      <section aria-labelledby="help-categories">
        <h2
          className="text-2xl font-semibold tracking-tight sm:text-3xl"
          id="help-categories"
        >
          {labels.categories}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(({ description, key, title }) => {
            const Icon = icons[key];
            return (
              <article
                className="bg-card/75 group rounded-3xl border p-6 shadow-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-md"
                key={key}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="bg-primary/10 text-primary grid size-11 place-items-center rounded-2xl">
                    <Icon aria-hidden className="size-5" />
                  </span>
                  {key === "ai" ? (
                    <Badge variant="ai">{labels.soon}</Badge>
                  ) : null}
                </div>
                <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-6">
                  {description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section
        aria-labelledby="help-faq"
        className="bg-card/75 rounded-[2rem] border p-5 shadow-sm sm:p-8"
      >
        <h2
          className="text-2xl font-semibold tracking-tight sm:text-3xl"
          id="help-faq"
        >
          {labels.faq}
        </h2>
        {filtered.length ? (
          <Accordion className="mt-5" collapsible type="single">
            {filtered.map(({ answer, id, question }) => (
              <AccordionItem key={id} value={id}>
                <AccordionTrigger className="py-5 text-base">
                  {question}
                </AccordionTrigger>
                <AccordionContent className="max-w-3xl pb-5 text-sm leading-7 sm:text-base">
                  {answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="text-muted-foreground py-10 text-center" role="status">
            {labels.empty}
          </p>
        )}
      </section>
    </div>
  );
}
