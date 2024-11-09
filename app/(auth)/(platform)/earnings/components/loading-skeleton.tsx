import { Skeleton } from "@/components/ui/skeleton";

export const CalendarSkeleton = () => (
  <div className="flex-1 flex flex-col h-full min-h-screen overflow-hidden">
    {/* Navbar Skeleton */}
    <div className="flex items-center justify-between p-4 border-b">
      <Skeleton className="h-10 w-32" />
      <div className="flex space-x-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>

    {/* Calendar Grid Skeleton */}
    <div className="flex-1 overflow-y-auto h-full">
      <div className="h-full flex flex-col bg-white dark:bg-slate-900">
        <div className="sticky top-0 z-10 grid grid-cols-5 py-1 bg-gray-100 dark:bg-slate-800">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="py-1 text-center">
              <Skeleton className="h-4 w-8 mx-auto" />
            </div>
          ))}
        </div>
        <div className="flex-1 grid grid-cols-5 gap-px bg-gray-200 dark:bg-slate-700">
          {[...Array(35)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 p-0.5 min-h-[150px]"
            >
              <Skeleton className="h-4 w-6 mb-1" />
              <div className="grid grid-cols-4 gap-0.5">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="aspect-square">
                    <Skeleton className="w-full h-full" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
