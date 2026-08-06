import { Skeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <main aria-busy="true" className="bg-background min-h-svh px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-24 w-full max-w-xl" />
        <div className="grid gap-5 lg:grid-cols-2">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-52 lg:col-span-2" />
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    </main>
  );
}
