"use client";

import React, { useEffect, useState } from "react";
import EarningsTranscript from "./EarningsTranscript";
import { useEarningsStore } from "@/store/EarningsStore";
import { EarningsCallTranscript } from "@/types/EarningsTranscripts";

interface EarningsTranscriptSheetProps {
  className?: string;
}

const EarningsTranscriptSheet: React.FC<EarningsTranscriptSheetProps> = ({
  className,
}) => {
  const { selectedCompany } = useEarningsStore();
  const [transcriptData, setTranscriptData] =
    useState<EarningsCallTranscript | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTranscript = async () => {
      if (selectedCompany && selectedCompany.id) {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(
            `/api/transcripts/${selectedCompany.id}`
          );
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
      }
    };

    fetchTranscript();
  }, [selectedCompany]);

  console.log(transcriptData);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100/80">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">
            Loading transcript...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!selectedCompany || !transcriptData) {
    return <div>No company selected or transcript data not available.</div>;
  }

  return (
    <div className={`h-screen p-4 overflow-y-auto bg-gray-100/80 ${className}`}>
      <EarningsTranscript
        transcriptData={transcriptData}
        // onBack={() => setSelectedCompany(null)}
      />
    </div>
  );
};

export default EarningsTranscriptSheet;
