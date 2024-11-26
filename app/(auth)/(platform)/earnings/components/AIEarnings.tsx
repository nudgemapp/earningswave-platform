"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Company, Transcript } from "@prisma/client";
import { useGetAISummary } from "@/app/hooks/use-get-ai-summary";

interface AIEarningsAnalysisProps {
  company: Company & {
    recentTranscripts?: Transcript[];
  };
}

const AIEarningsAnalysis: React.FC<AIEarningsAnalysisProps> = ({ company }) => {
  console.log(company);

  const [loading, setLoading] = useState(false);

  // Get the most recent completed transcript
  const latestTranscript = company.recentTranscripts?.find(
    (t) => t.status === "COMPLETED"
  );

  // Format quarter display
  const getQuarterDisplay = (transcript: Transcript | undefined) => {
    if (!transcript?.quarter || !transcript?.year) return "Latest Quarter";
    return `Q${transcript.quarter} ${transcript.year}`;
  };

  console.log(latestTranscript);

  const { data: aiSummary, isLoading: aiSummaryLoading } = useGetAISummary(
    latestTranscript?.id
  );

  console.log(aiSummary);

  // useEffect(() => {
  //   const fetchAiAnalysis = async () => {
  //     if (!latestTranscript?.id) return;

  //     setLoading(true);
  //     try {
  //       const response = await fetch(
  //         `/api/earnings/${latestTranscript.id}/aiSummary`
  //       );
  //       if (!response.ok) throw new Error("Failed to fetch AI analysis");
  //       const data = await response.json();
  //       setAnalysis(data.analysis);
  //     } catch (error) {
  //       console.error("Error fetching AI analysis:", error);
  //       setAnalysis(null);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchAiAnalysis();
  // }, [latestTranscript?.id]);

  if (!latestTranscript) return null;

  return (
    <Card className="w-full shadow-sm dark:shadow-slate-800/50 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
          AI Earnings Analysis - {getQuarterDisplay(latestTranscript)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : aiSummary ? (
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-400">
              {aiSummary.analysis}
            </p>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No analysis available for this earnings call.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default AIEarningsAnalysis;
