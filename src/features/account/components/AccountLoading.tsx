import { Skeleton } from "@/components/ui/Skeleton";

export function AccountLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <Skeleton className="h-12 w-44 rounded-full" />
      <Skeleton className="h-72 rounded-[2.5rem]" />
      <Skeleton className="h-96 rounded-[2rem]" />
    </main>
  );
}
