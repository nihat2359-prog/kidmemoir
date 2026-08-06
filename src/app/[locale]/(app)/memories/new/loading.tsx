import { Skeleton } from "@/components/ui/Skeleton";

export default function CreateMemoryLoading() {
  return (
    <main
      aria-busy="true"
      className="mx-auto min-h-svh w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8"
    >
      <Skeleton className="h-80 w-full rounded-[2.5rem]" />
      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton className="h-36 rounded-[1.75rem]" key={index} />
        ))}
      </div>
      <Skeleton className="mt-8 h-[38rem] w-full rounded-[2rem]" />
    </main>
  );
}
