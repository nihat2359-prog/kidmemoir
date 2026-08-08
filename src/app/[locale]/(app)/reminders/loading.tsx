import { Skeleton } from "@/components/ui/Skeleton";
export default function RemindersLoading() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-64 rounded-[2.5rem]" />
      <Skeleton className="h-24 rounded-[2rem]" />
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton className="h-48 rounded-[1.75rem]" key={i} />
        ))}
      </div>
    </div>
  );
}
