// import { motion } from "framer-motion";
// import { Lightbulb } from "lucide-react";
// import { AISummary } from "./AIEarnings";

// export const HighlightCard = ({
//   highlight,
//   index,
// }: {
//   highlight: AISummary["keyHighlights"][0];
//   index: number;
// }) => (
//   <motion.div
//     key={index}
//     initial={{ x: -20, opacity: 0 }}
//     animate={{ x: 0, opacity: 1 }}
//     transition={{ delay: 0.5 + index * 0.1 }}
//     className="p-4 rounded-lg bg-white/50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800"
//   >
//     <h5 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
//       {highlight.title}
//     </h5>
//     <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
//       {highlight.description}
//     </p>
//     <div className="text-sm">
//       <span className="text-purple-600 dark:text-purple-300 font-medium">
//         Impact:
//       </span>{" "}
//       <span className="text-gray-600 dark:text-gray-300">
//         {highlight.impact}
//       </span>
//     </div>
//     <div className="mt-2">
//       <span className="inline-block px-2 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200">
//         {highlight.category}
//       </span>
//     </div>
//   </motion.div>
// );

// export const PerformanceCard = ({
//   item,
//   index,
// }: {
//   item: AISummary["performanceAnalysis"][0];
//   index: number;
// }) => (
//   <motion.div
//     key={index}
//     initial={{ x: -20, opacity: 0 }}
//     animate={{ x: 0, opacity: 1 }}
//     transition={{ delay: 0.7 + index * 0.1 }}
//     className="p-4 rounded-lg bg-white/50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800"
//   >
//     <h5 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
//       {item.metric}
//     </h5>
//     <p
//       className={`text-sm ${
//         item.trend === "positive"
//           ? "text-green-600"
//           : item.trend === "negative"
//           ? "text-red-600"
//           : "text-gray-600"
//       } dark:text-gray-300`}
//     >
//       {item.value}
//     </p>
//     <p className="text-sm text-gray-600 dark:text-gray-300">{item.analysis}</p>
//   </motion.div>
// );

// export const InitiativesAndRisks = ({
//   initiatives,
//   risks,
// }: {
//   initiatives: string[];
//   risks: string[];
// }) => (
//   <div className="space-y-4">
//     <div className="space-y-2">
//       <h5 className="text-sm font-medium text-purple-800 dark:text-purple-200">
//         Key Initiatives
//       </h5>
//       <ul className="space-y-2">
//         {initiatives.map((initiative, index) => (
//           <motion.li
//             key={index}
//             initial={{ x: -20, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ delay: 0.7 + index * 0.1 }}
//             className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2"
//           >
//             <span className="w-1.5 h-1.5 rounded-full bg-purple-400 dark:bg-purple-500" />
//             {initiative}
//           </motion.li>
//         ))}
//       </ul>
//     </div>
//     {risks.length > 0 && (
//       <div className="space-y-2">
//         <h5 className="text-sm font-medium text-purple-800 dark:text-purple-200">
//           Key Risks
//         </h5>
//         <ul className="space-y-2">
//           {risks.map((risk, index) => (
//             <motion.li
//               key={index}
//               initial={{ x: -20, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ delay: 0.8 + index * 0.1 }}
//               className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2"
//             >
//               <span className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500" />
//               {risk}
//             </motion.li>
//           ))}
//         </ul>
//       </div>
//     )}
//   </div>
// );

// export const HighlightsSection = ({
//   highlights,
// }: {
//   highlights: AISummary["keyHighlights"];
// }) => (
//   <motion.div
//     initial={{ y: 20, opacity: 0 }}
//     animate={{ y: 0, opacity: 1 }}
//     className="space-y-4"
//   >
//     <h4 className="text-md font-medium text-purple-800 dark:text-purple-200 flex items-center gap-2">
//       <Lightbulb className="w-4 h-4" />
//       Key Highlights
//     </h4>
//     <div className="grid gap-4 md:grid-cols-2">
//       {highlights.map((highlight, index) => (
//         <HighlightCard key={index} highlight={highlight} index={index} />
//       ))}
//     </div>
//   </motion.div>
// );

// export const PerformanceSection = ({
//   analysis,
// }: {
//   analysis: AISummary["performanceAnalysis"];
// }) => (
//   <motion.div
//     initial={{ y: 20, opacity: 0 }}
//     animate={{ y: 0, opacity: 1 }}
//     className="space-y-4"
//   >
//     <h4 className="text-md font-medium text-purple-800 dark:text-purple-200">
//       Performance Analysis
//     </h4>
//     <div className="grid gap-4 md:grid-cols-2">
//       {analysis.map((item, index) => (
//         <PerformanceCard key={index} item={item} index={index} />
//       ))}
//     </div>
//   </motion.div>
// );

// export const GuidanceSection = ({
//   guidance,
// }: {
//   guidance: AISummary["forwardGuidance"];
// }) => (
//   <motion.div
//     initial={{ y: 20, opacity: 0 }}
//     animate={{ y: 0, opacity: 1 }}
//     className="space-y-4"
//   >
//     <h4 className="text-md font-medium text-purple-800 dark:text-purple-200">
//       Forward Guidance
//     </h4>
//     <p className="text-gray-700 dark:text-gray-300">{guidance.outlook}</p>
//     <InitiativesAndRisks
//       initiatives={guidance.keyInitiatives}
//       risks={guidance.risks}
//     />
//   </motion.div>
// );

// export const SentimentSection = ({
//   sentiment,
// }: {
//   sentiment: AISummary["sentiment"];
// }) => (
//   <motion.div
//     initial={{ y: 20, opacity: 0 }}
//     animate={{ y: 0, opacity: 1 }}
//     className="space-y-4"
//   >
//     <h4 className="text-md font-medium text-purple-800 dark:text-purple-200">
//       Sentiment Analysis
//     </h4>
//     <div className="bg-white/50 dark:bg-purple-900/20 rounded-lg p-4">
//       <div className="flex items-center justify-between mb-2">
//         <span className="font-medium text-purple-900 dark:text-purple-100">
//           {sentiment.label.toUpperCase()}
//         </span>
//         <span className="text-sm text-purple-600 dark:text-purple-300">
//           Score: {sentiment.score.toFixed(2)}
//         </span>
//       </div>
//       <p className="text-sm text-gray-600 dark:text-gray-300">
//         {sentiment.rationale}
//       </p>
//     </div>
//   </motion.div>
// );

// // "use client";

// // import React from "react";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { Loader2, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
// // import { motion, AnimatePresence } from "framer-motion";
// // import { Company, Transcript } from "@prisma/client";
// // import { useGetAISummary } from "@/app/hooks/use-get-ai-summary";
// // import {
// //   GuidanceSection,
// //   HighlightsSection,
// //   PerformanceSection,
// //   SentimentSection,
// // } from "./AiSections";

// // interface AIEarningsAnalysisProps {
// //   company: Company & {
// //     recentTranscripts?: Transcript[];
// //   };
// // }

// // // Type definition matching your Prisma schema
// // export interface AISummary {
// //   summary: {
// //     overview: string;
// //     quarterHighlights?: string;
// //     challenges?: string;
// //   };
// //   keyHighlights: Array<{
// //     category: string;
// //     title: string;
// //     description: string;
// //     impact: string;
// //   }>;
// //   performanceAnalysis: Array<{
// //     metric: string;
// //     value: string;
// //     analysis: string;
// //     trend: "positive" | "neutral" | "negative";
// //   }>;
// //   forwardGuidance: {
// //     outlook: string;
// //     keyInitiatives: string[];
// //     risks: string[];
// //   };
// //   sentiment: {
// //     score: number;
// //     label: "bullish" | "neutral" | "bearish";
// //     rationale: string;
// //   };
// // }

// // const AIEarningsAnalysis: React.FC<AIEarningsAnalysisProps> = ({ company }) => {
// //   const latestTranscript = company.recentTranscripts?.find(
// //     (t) => t.status === "COMPLETED"
// //   );

// //   const {
// //     data: aiSummary,
// //     isLoading,
// //     error,
// //   } = useGetAISummary(latestTranscript?.id);

// //   console.log(aiSummary);

// //   const formattedAiSummary = aiSummary
// //     ? {
// //         summary: aiSummary.summary,
// //         keyHighlights: aiSummary.keyHighlights,
// //         performanceAnalysis: aiSummary.performanceAnalysis,
// //         forwardGuidance: aiSummary.forwardGuidance,
// //         sentiment: aiSummary.sentiment,
// //       }
// //     : null;

// //   console.log(formattedAiSummary);

// //   if (!latestTranscript) return null;

// //   return (
// //     <AnimatePresence mode="wait">
// //       <motion.div
// //         key={latestTranscript.id}
// //         initial={{ opacity: 0, y: 20 }}
// //         animate={{ opacity: 1, y: 0 }}
// //         exit={{ opacity: 0, y: -20 }}
// //         transition={{ duration: 0.5 }}
// //       >
// //         <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
// //           <CardContent className="relative z-10 p-6">
// //             {isLoading ? (
// //               <LoadingState />
// //             ) : error ? (
// //               <ErrorState error={error as Error} />
// //             ) : formattedAiSummary ? (
// //               <ContentState aiSummary={formattedAiSummary as AISummary} />
// //             ) : (
// //               <EmptyState />
// //             )}
// //           </CardContent>
// //         </Card>
// //       </motion.div>
// //     </AnimatePresence>
// //   );
// // };

// // const ContentState = ({ aiSummary }: { aiSummary: AISummary }) => (
// //   <motion.div
// //     initial={{ opacity: 0 }}
// //     animate={{ opacity: 1 }}
// //     transition={{ duration: 0.5 }}
// //     className="space-y-6"
// //   >
// //     {/* Overview Section */}
// //     <SummarySection summary={aiSummary.summary} />

// //     {/* Key Highlights Section */}
// //     {aiSummary.keyHighlights?.length > 0 && (
// //       <HighlightsSection highlights={aiSummary.keyHighlights} />
// //     )}

// //     {/* Performance Analysis Section */}
// //     {aiSummary.performanceAnalysis?.length > 0 && (
// //       <PerformanceSection analysis={aiSummary.performanceAnalysis} />
// //     )}

// //     {/* Forward Guidance Section */}
// //     {aiSummary.forwardGuidance && (
// //       <GuidanceSection guidance={aiSummary.forwardGuidance} />
// //     )}

// //     {/* Sentiment Section */}
// //     {aiSummary.sentiment && (
// //       <SentimentSection sentiment={aiSummary.sentiment} />
// //     )}
// //   </motion.div>
// // );

// // const SummarySection = ({ summary }: { summary: AISummary["summary"] }) => (
// //   <motion.div
// //     initial={{ y: 20, opacity: 0 }}
// //     animate={{ y: 0, opacity: 1 }}
// //     className="space-y-4"
// //   >
// //     <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 flex items-center gap-2">
// //       <TrendingUp className="w-5 h-5" />
// //       Overview
// //     </h3>
// //     <p className="text-gray-700 dark:text-gray-300">{summary.overview}</p>
// //     {summary.quarterHighlights && (
// //       <div className="mt-4">
// //         <h4 className="text-md font-medium text-purple-800 dark:text-purple-200">
// //           Quarter Highlights
// //         </h4>
// //         <p className="text-gray-700 dark:text-gray-300 mt-2">
// //           {summary.quarterHighlights}
// //         </p>
// //       </div>
// //     )}
// //     {summary.challenges && (
// //       <div className="mt-4">
// //         <h4 className="text-md font-medium text-purple-800 dark:text-purple-200">
// //           Challenges
// //         </h4>
// //         <p className="text-gray-700 dark:text-gray-300 mt-2">
// //           {summary.challenges}
// //         </p>
// //       </div>
// //     )}
// //   </motion.div>
// // );

// // const LoadingState = () => (
// //   <div className="flex flex-col items-center justify-center py-8 space-y-4">
// //     <Loader2 className="w-8 h-8 animate-spin text-purple-600 dark:text-purple-400" />
// //     <p className="text-sm text-purple-600 dark:text-purple-400 animate-pulse">
// //       Analyzing earnings call...
// //     </p>
// //   </div>
// // );

// // const EmptyState = () => (
// //   <div className="flex items-center justify-center py-8">
// //     <p className="text-sm text-gray-500 dark:text-gray-400">
// //       No analysis available for this earnings call.
// //     </p>
// //   </div>
// // );

// // const ErrorState = ({ error }: { error: Error }) => (
// //   <div className="flex items-center justify-center py-8 text-red-500">
// //     <p className="text-sm">Error: {error.message}</p>
// //   </div>
// // );

// // export default AIEarningsAnalysis;
