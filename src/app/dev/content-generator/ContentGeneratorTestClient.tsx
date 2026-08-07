"use client";

import { useActionState } from "react";
import { generateDevelopmentContent, type DevGeneratorState } from "./actions";

const initialState: DevGeneratorState = { error: null, result: null };

export function ContentGeneratorTestClient() {
  const [state, action, pending] = useActionState(
    generateDevelopmentContent,
    initialState,
  );
  const result = state.result;
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-sm font-semibold text-sky-400">Development only</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Content Generation Engine
          </h1>
        </header>
        <form
          action={action}
          className="grid gap-5 rounded-2xl border border-white/10 bg-white/5 p-6 md:grid-cols-2"
        >
          <label className="grid gap-2 text-sm font-medium md:col-span-2">
            Topic
            <input
              className="h-12 rounded-xl border border-white/15 bg-slate-900 px-4 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              defaultValue="Baby Memory Book"
              name="topic"
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Locale
            <select
              className="h-12 rounded-xl border border-white/15 bg-slate-900 px-4"
              defaultValue="en"
              name="locale"
            >
              <option value="tr">TR</option>
              <option value="en">EN</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Template
            <select
              className="h-12 rounded-xl border border-white/15 bg-slate-900 px-4"
              defaultValue="guide"
              name="template"
            >
              {[
                "guide",
                "checklist",
                "timeline",
                "faq",
                "knowledge",
                "comparison",
                "ideas",
                "tool",
              ].map((template) => (
                <option key={template} value={template}>
                  {template}
                </option>
              ))}
            </select>
          </label>
          <button
            className="h-12 rounded-xl bg-sky-500 px-6 font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-wait disabled:opacity-60 md:col-span-2"
            disabled={pending}
            type="submit"
          >
            {pending ? "Generating…" : "Generate"}
          </button>
        </form>

        {state.error ? (
          <div className="mt-6 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-red-200">
            {state.error}
          </div>
        ) : null}

        {result ? (
          <div className="mt-8 space-y-6">
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <Metric
                label="Quality Score"
                value={`${result.quality.score}/100`}
              />
              <Metric
                label="Token Usage"
                value={result.usage.totalTokens.toLocaleString()}
              />
              <Metric
                label="Generation Time"
                value={`${(result.usage.durationMs / 1000).toFixed(2)}s`}
              />
              <Metric
                label="First-pass Validation"
                value={
                  result.usage.initialValidationPassed ? "Passed" : "Repaired"
                }
              />
              <Metric
                label="Repair Usage"
                value={`${result.usage.repairAttempts} / ${result.usage.repairInputTokens + result.usage.repairOutputTokens} tokens`}
              />
            </section>
            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-sm font-semibold text-sky-400">SEO Title</h2>
              <p className="mt-2 text-xl font-semibold">{result.seo.title}</p>
              <h2 className="mt-6 text-sm font-semibold text-sky-400">
                Meta Description
              </h2>
              <p className="mt-2 text-slate-300">{result.seo.description}</p>
            </section>
            <OutputBlock label="Markdown" value={result.markdown} />
            <OutputBlock label="JSON" value={JSON.stringify(result, null, 2)} />
          </div>
        ) : null}
      </div>
    </main>
  );
}

function Metric({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function OutputBlock({
  label,
  value,
}: Readonly<{ label: string; value: string }>) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="mb-4 text-lg font-semibold">{label}</h2>
      <pre className="max-h-[42rem] overflow-auto rounded-xl bg-black/30 p-4 text-xs leading-6 whitespace-pre-wrap text-slate-300">
        {value}
      </pre>
    </section>
  );
}
