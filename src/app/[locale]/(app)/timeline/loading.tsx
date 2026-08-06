import { Skeleton } from "@/components/ui/Skeleton";
export default function TimelineLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <Skeleton className="h-80 rounded-[2.5rem]" />
      <Skeleton className="h-52 rounded-[2rem]" />
      <div className="grid gap-5 lg:grid-cols-2">
        <Skeleton className="h-96 rounded-[2rem]" />
        <Skeleton className="h-96 rounded-[2rem]" />
      </div>
    </main>
  );
}
