"use client";

import { useGetWatchlist } from "@/app/hooks/use-get-watchlist";
import { useWatchlistMutations } from "@/app/hooks/use-watchlist-mutations";
import { Button } from "@/components/ui/button";
import { useEarningsStore } from "@/store/EarningsStore";
import { Loader2, Star as StarIcon, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

const Watchlist = () => {
  const { data, isLoading, error } = useGetWatchlist();
  const { removeFromWatchlist } = useWatchlistMutations();

  const handleRemoveFromWatchlist = async (companyId: number) => {
    try {
      await removeFromWatchlist.mutateAsync(companyId);
      toast.success("Removed from watchlist");
    } catch {
      toast.error("Failed to remove from watchlist");
    }
  };

  const handleClose = () => {
    useEarningsStore.setState({ showWatchlist: false });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48 bg-white dark:bg-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500 dark:text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 dark:text-red-400 bg-white dark:bg-slate-900">
        Error loading watchlist. Please try again.
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-slate-900">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Your Watchlist
        </h2>
        <button
          onClick={handleClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          aria-label="Close watchlist"
        >
          <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
      {!data?.entries || data.entries.length === 0 ? (
        <div className="text-center py-8 mt-60">
          <StarIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-2">
            Your watchlist is empty
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm max-w-md mx-auto">
            Add companies to your watchlist to stay up to date with their
            earnings announcements and financial performance.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-slate-800/50 hover:shadow-md dark:hover:shadow-slate-800/80 transition-all cursor-pointer active:scale-[0.98]"
              onClick={() => {
                useEarningsStore.setState({
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
                    <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-slate-800 rounded-md">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {entry.company.symbol.substring(0, 2)}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {entry.company.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {entry.company.symbol}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800"
                  onClick={() => {
                    useEarningsStore.setState({
                      selectedFutureEarnings: null,
                      selectedCompany: entry.company,
                      showWatchlist: false,
                    });
                  }}
                >
                  View Details
                </Button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFromWatchlist(entry.company.id);
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors active:scale-95"
                  disabled={removeFromWatchlist.isPending}
                >
                  <StarIcon
                    className={`w-5 h-5 ${
                      removeFromWatchlist.isPending
                        ? "text-gray-300 dark:text-gray-600"
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
