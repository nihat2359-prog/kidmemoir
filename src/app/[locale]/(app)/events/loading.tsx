import { Skeleton } from "@/components/ui/Skeleton";
export default function EventsLoading() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-64 rounded-[2.5rem]" />
      <Skeleton className="h-52 rounded-[2rem]" />
      <div className="grid gap-5 lg:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton className="h-80 rounded-[2rem]" key={i} />
        ))}
      </div>
    </div>
  );
}
