"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, TrendingUp, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Company, Transcript } from "@prisma/client";
import { useGetAISummary } from "@/app/hooks/use-get-ai-summary";
import { AISummary } from "../types";

interface AIEarningsAnalysisProps {
  company: Company & {
    recentTranscripts?: Transcript[];
  };
}

const AIEarningsAnalysis: React.FC<AIEarningsAnalysisProps> = ({ company }) => {
  const latestTranscript = company.recentTranscripts?.find(
    (t) => t.status === "COMPLETED"
  );

  const { data, isLoading, error } = useGetAISummary(latestTranscript?.id);

  console.log(data);

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
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-purple-600/5 dark:from-purple-400/10 dark:to-purple-500/10" />

          <div className="relative z-10">
            {isLoading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState error={error as Error} />
            ) : data ? (
              <ContentState aiSummary={data} />
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
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

const ContentState = ({ aiSummary }: { aiSummary: AISummary }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="space-y-6 p-6"
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
        {aiSummary.summary.overview}
      </p>
    </motion.div>

    {/* Quarter Highlights & Challenges Section - Improved layout */}
    {(aiSummary.summary.quarterHighlights || aiSummary.summary.challenges) && (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="grid gap-4 md:grid-cols-2"
      >
        {aiSummary.summary.quarterHighlights && (
          <div className="p-4 rounded-lg bg-white/50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
            <h4 className="text-md font-medium text-purple-800 dark:text-purple-200 mb-2">
              Quarter Highlights
            </h4>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {aiSummary.summary.quarterHighlights}
            </p>
          </div>
        )}

        {aiSummary.summary.challenges && (
          <div className="p-4 rounded-lg bg-white/50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
            <h4 className="text-md font-medium text-purple-800 dark:text-purple-200 mb-2">
              Challenges
            </h4>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {aiSummary.summary.challenges}
            </p>
          </div>
        )}
      </motion.div>
    )}

    {/* Sentiment Section */}
    {aiSummary.sentiment && (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <h4 className="text-md font-medium text-purple-800 dark:text-purple-200">
          Sentiment
        </h4>
        <div className="space-y-2">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            <span className="font-medium">Overall: </span>
            {aiSummary.sentiment.label} (Score: {aiSummary.sentiment.score})
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {aiSummary.sentiment.rationale}
          </p>
        </div>
      </motion.div>
    )}

    {/* Key Highlights Section */}
    {aiSummary.keyHighlights && (
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
        <div className="grid gap-4">
          {aiSummary.keyHighlights.map((highlight, index) => (
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
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {highlight.description}
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                Impact: {highlight.impact}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )}

    {/* Performance Analysis Section */}
    {aiSummary.performanceAnalysis && (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.65 }}
        className="space-y-4"
      >
        <h4 className="text-md font-medium text-purple-800 dark:text-purple-200">
          Performance Analysis
        </h4>
        <div className="grid gap-4">
          {aiSummary.performanceAnalysis.map((analysis, index) => (
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
                    ? "text-green-600 dark:text-green-400"
                    : analysis.trend === "negative"
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-600 dark:text-gray-400"
                } font-medium`}
              >
                {analysis.value}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {analysis.analysis}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )}

    {/* Forward Guidance Section */}
    {aiSummary.forwardGuidance && (
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
          {aiSummary.forwardGuidance.outlook}
        </p>

        <div className="space-y-4">
          <div>
            <h5 className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">
              Key Initiatives
            </h5>
            <ul className="space-y-2">
              {aiSummary.forwardGuidance.keyInitiatives.map(
                (initiative, index) => (
                  <motion.li
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 dark:bg-green-500" />
                    {initiative}
                  </motion.li>
                )
              )}
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">
              Potential Risks
            </h5>
            <ul className="space-y-2">
              {aiSummary.forwardGuidance.risks.map((risk, index) => (
                <motion.li
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500" />
                  {risk}
                </motion.li>
              ))}
            </ul>
          </div>
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
