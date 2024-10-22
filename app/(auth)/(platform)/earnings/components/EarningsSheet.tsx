"use client";

import React, { useEffect, useState } from "react";
import EarningsTranscript from "./EarningsTranscript";
import { useEarningsStore } from "@/store/EarningsStore";
import { EarningsCallTranscript } from "@/types/EarningsTranscripts";
import { useUser } from "@clerk/nextjs";

interface EarningsTranscriptSheetProps {
  className?: string;
}

const EarningsTranscriptSheet: React.FC<EarningsTranscriptSheetProps> = ({
  className,
}) => {
  const user = useUser();
  const { selectedCompany } = useEarningsStore();
  const [transcriptData, setTranscriptData] =
    useState<EarningsCallTranscript | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTranscript = async (id: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/transcripts/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch transcript");
        }
        const data = await response.json();
        setTranscriptData(data);
      } catch (error) {
        console.error("Failed to fetch transcript:", error);
        setError("Failed to load transcript. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedCompany && selectedCompany.id) {
      fetchTranscript(selectedCompany.id);
    }
  }, [selectedCompany]);

  const CustomLoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black"></div>
      <p className="mt-4 text-gray-600 font-semibold">Loading transcript...</p>
    </div>
  );

  return (
    <div className={`h-screen p-4 overflow-y-auto bg-gray-100/80 ${className}`}>
      {isLoading ? (
        <CustomLoadingSpinner />
      ) : error ? (
        <div className="p-4 text-red-500">Error: {error}</div>
      ) : transcriptData ? (
        <EarningsTranscript transcriptData={transcriptData} />
      ) : (
        <div className="p-4">No transcript available.</div>
      )}
    </div>
  );
};

export default EarningsTranscriptSheet;
