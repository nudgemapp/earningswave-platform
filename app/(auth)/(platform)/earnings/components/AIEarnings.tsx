"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Company, Transcript } from "@prisma/client";
import { useGetAISummary } from "@/app/hooks/use-get-ai-summary";

interface AIEarningsAnalysisProps {
  company: Company & {
    recentTranscripts?: Transcript[];
  };
}

const AIEarningsAnalysis: React.FC<AIEarningsAnalysisProps> = ({ company }) => {
  const latestTranscript = company.recentTranscripts?.find(
    (t) => t.status === "COMPLETED"
  );

  const {
    data: aiSummary,
    isLoading,
    error,
  } = useGetAISummary(latestTranscript?.id);

  console.log(aiSummary);

  console.log(latestTranscript);

  if (!latestTranscript) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={latestTranscript.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-purple-600/5 dark:from-purple-400/10 dark:to-purple-500/10" />

          <CardContent className="relative z-10 p-6">
            {isLoading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState error={error as Error} />
            ) : aiSummary ? (
              <ContentState aiSummary={aiSummary} />
            ) : (
              <EmptyState />
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-8 space-y-4">
    <Loader2 className="w-8 h-8 animate-spin text-purple-600 dark:text-purple-400" />
    <p className="text-sm text-purple-600 dark:text-purple-400 animate-pulse">
      Analyzing earnings call...
    </p>
  </div>
);

const EmptyState = () => (
  <div className="flex items-center justify-center py-8">
    <p className="text-sm text-gray-500 dark:text-gray-400">
      No analysis available for this earnings call.
    </p>
  </div>
);

const ContentState = ({ aiSummary }: { aiSummary: any }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="space-y-6"
  >
    {/* Overview Section */}
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 flex items-center gap-2">
        <TrendingUp className="w-5 h-5" />
        Key Takeaways
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        {aiSummary.keyPoints?.summary?.overview}
      </p>
    </motion.div>

    {/* Challenges Section */}
    {aiSummary.keyPoints?.summary?.challenges && (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="space-y-4"
      >
        <h4 className="text-md font-medium text-purple-800 dark:text-purple-200">
          Challenges
        </h4>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {aiSummary.keyPoints.summary.challenges}
        </p>
      </motion.div>
    )}

    {/* Sentiment Section */}
    {aiSummary.keyPoints?.sentiment && (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <h4 className="text-md font-medium text-purple-800 dark:text-purple-200">
          Sentiment
        </h4>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {`Label: ${aiSummary.keyPoints.sentiment.label}, Score: ${aiSummary.keyPoints.sentiment.score}`}
        </p>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {aiSummary.keyPoints.sentiment.rationale}
        </p>
      </motion.div>
    )}

    {/* Highlights Section */}
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.45 }}
      className="space-y-4"
    >
      <h4 className="text-md font-medium text-purple-800 dark:text-purple-200 flex items-center gap-2">
        <Lightbulb className="w-4 h-4" />
        Key Highlights
      </h4>
      <div className="grid gap-4 md:grid-cols-2">
        {aiSummary.keyPoints?.keyHighlights?.map(
          (highlight: any, index: number) => (
            <motion.div
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="p-4 rounded-lg bg-white/50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800"
            >
              <h5 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                {highlight.title}
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {highlight.description}
              </p>
            </motion.div>
          )
        )}
      </div>
    </motion.div>

    {/* Forward Guidance Section */}
    {aiSummary.keyPoints?.forwardGuidance && (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="space-y-4"
      >
        <h4 className="text-md font-medium text-purple-800 dark:text-purple-200">
          Forward Guidance
        </h4>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {aiSummary.keyPoints.forwardGuidance.outlook}
        </p>
        <ul className="space-y-2">
          {aiSummary.keyPoints.forwardGuidance.risks.map(
            (risk: string, index: number) => (
              <motion.li
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 dark:bg-purple-500" />
                {risk}
              </motion.li>
            )
          )}
        </ul>
      </motion.div>
    )}

    {/* Performance Analysis Section */}
    {aiSummary.keyPoints?.performanceAnalysis && (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.65 }}
        className="space-y-4"
      >
        <h4 className="text-md font-medium text-purple-800 dark:text-purple-200">
          Performance Analysis
        </h4>
        <div className="grid gap-4 md:grid-cols-2">
          {aiSummary.keyPoints.performanceAnalysis.map(
            (analysis: any, index: number) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="p-4 rounded-lg bg-white/50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800"
              >
                <h5 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                  {analysis.metric}
                </h5>
                <p
                  className={`text-sm ${
                    analysis.trend === "positive"
                      ? "text-green-600"
                      : analysis.trend === "negative"
                      ? "text-red-600"
                      : "text-gray-600"
                  } dark:text-gray-300`}
                >
                  {analysis.value}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {analysis.analysis}
                </p>
              </motion.div>
            )
          )}
        </div>
      </motion.div>
    )}
  </motion.div>
);

const ErrorState = ({ error }: { error: Error }) => (
  <div className="flex items-center justify-center py-8 text-red-500">
    <p className="text-sm">Error: {error.message}</p>
  </div>
);

export default AIEarningsAnalysis;
