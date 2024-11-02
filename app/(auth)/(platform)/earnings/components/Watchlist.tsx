"use client";

import { useGetWatchlist } from "@/app/hooks/use-get-watchlist";
import { useWatchlistMutations } from "@/app/hooks/use-watchlist-mutations";
import { Button } from "@/components/ui/button";
import { useEarningsStore } from "@/store/EarningsStore";
import { Loader2, Star as StarIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

const Watchlist = () => {
  const { data, isLoading, error } = useGetWatchlist();
  const { removeFromWatchlist } = useWatchlistMutations();

  const handleRemoveFromWatchlist = async (companyId: number) => {
    try {
      await removeFromWatchlist.mutateAsync(companyId);
      toast.success("Removed from watchlist");
    } catch (error) {
      toast.error("Failed to remove from watchlist");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading watchlist. Please try again.
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Watchlist</h2>
      {!data?.entries || data.entries.length === 0 ? (
        <div className="text-center py-8 mt-60">
          <StarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium mb-2">
            Your watchlist is empty
          </p>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Add companies to your watchlist to stay up to date with their
            earnings announcements and financial performance.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
              onClick={() => {
                useEarningsStore.setState({
                  //   selectedFutureEarnings: entry.company.earnings,
                  selectedCompany: entry.company,
                  showWatchlist: false,
                });
              }}
            >
              <div className="flex items-center space-x-4">
                <div className="relative h-12 w-12">
                  {entry.company.logo ? (
                    <Image
                      src={entry.company.logo.data as unknown as string}
                      alt={entry.company.name}
                      layout="fill"
                      objectFit="contain"
                      className="rounded-md"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-md">
                      <span className="text-sm font-medium">
                        {entry.company.symbol.substring(0, 2)}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{entry.company.name}</h3>
                  <p className="text-sm text-gray-500">
                    {entry.company.symbol}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    useEarningsStore.setState({
                      // @ts-expect-error
                      selectedFutureEarnings: entry.company.earningsReports,
                      selectedCompany: null,
                      showWatchlist: false,
                    });
                  }}
                >
                  View Details
                </Button>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click when clicking star
                    handleRemoveFromWatchlist(entry.company.id);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
                  disabled={removeFromWatchlist.isPending}
                >
                  <StarIcon
                    className={`w-5 h-5 ${
                      removeFromWatchlist.isPending
                        ? "text-gray-300"
                        : "fill-yellow-400 text-yellow-400"
                    }`}
                    fill="currentColor"
                    strokeWidth={2}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
