import { Skeleton } from "@/components/ui/Skeleton";
export default function AiLoading() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-72 rounded-[2.5rem]" />
      <Skeleton className="h-56 rounded-[2rem]" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-72 rounded-[2rem]" />
        <Skeleton className="h-72 rounded-[2rem]" />
      </div>
    </div>
  );
}
