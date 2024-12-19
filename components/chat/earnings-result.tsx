import { cn } from "@/lib/utils";
import { CalendarIcon, CheckCircle2, Clock, XCircle } from "lucide-react";
import { UIBlock } from "./block";
import { Dispatch, SetStateAction } from "react";

interface EarningsResult {
  symbol: string;
  date: string;
  time: string;
  quarter: number;
  year: number;
  isConfirmed: boolean;
  transcript: string | null;
}

interface EarningsResultProps {
  result: EarningsResult;
  block: UIBlock;
  setBlock: Dispatch<SetStateAction<UIBlock>>;
  isReadonly: boolean;
}

export function EarningsResult({
  result,
}: // block,
// setBlock,
// isReadonly,
EarningsResultProps) {
  const formattedDate = new Date(result.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl bg-purple-50/30 border border-purple-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-purple-900">
            {result.symbol}
          </span>
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
            Q{result.quarter} {result.year}
          </span>
        </div>
        {result.isConfirmed ? (
          <CheckCircle2 className="text-green-600 size-5" />
        ) : (
          <XCircle className="text-amber-600 size-5" />
        )}
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-purple-800">
          <CalendarIcon className="size-4" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-1.5 text-purple-800">
          <Clock className="size-4" />
          <span>{result.time}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={cn("text-sm", {
            "text-green-700": result.isConfirmed,
            "text-amber-700": !result.isConfirmed,
          })}
        >
          {result.isConfirmed ? "Confirmed" : "Estimated"} Earnings Call
        </span>
      </div>
    </div>
  );
}
