"use client";

import React, { useEffect, useState } from "react";
import EarningsTranscript from "./EarningsTranscript";
import FutureEarnings from "./FutureEarnings";
import WelcomeMessage from "./WelcomeMessage";
import { useEarningsStore } from "@/store/EarningsStore";
import { EarningsCallTranscript } from "@/types/EarningsTranscripts";

interface EarningsTranscriptSheetProps {
  className?: string;
}

const EarningsTranscriptSheet: React.FC<EarningsTranscriptSheetProps> = ({
  className,
}) => {
  const { selectedCompany, selectedFutureEarnings } = useEarningsStore();
  const [transcriptData, setTranscriptData] =
    useState<EarningsCallTranscript | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
    } else {
      setTranscriptData(null);
      setIsLoading(false);
      setError(null);
    }
  }, [selectedCompany]);

  const CustomLoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black"></div>
      <p className="mt-4 text-gray-600 font-semibold">Loading transcript...</p>
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return <CustomLoadingSpinner />;
    }
    if (error) {
      return <div className="p-4 text-red-500">Error: {error}</div>;
    }
    if (transcriptData) {
      return <EarningsTranscript transcriptData={transcriptData} />;
    }
    if (selectedFutureEarnings) {
      return <FutureEarnings report={selectedFutureEarnings} />;
    }
    return <WelcomeMessage />;
  };

  return (
    <div className={`h-screen p-4 overflow-y-auto bg-gray-100/80 ${className}`}>
      {renderContent()}
    </div>
  );
};

export default EarningsTranscriptSheet;
