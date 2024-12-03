"use client";

import { useGetTranscriptData } from "@/app/hooks/use-get-transcript-data";
import { useEarningsStore } from "@/store/EarningsStore";
import {
  ChevronLeft,
  Volume2,
  Calendar,
  Clock,
  Lock,
  CalendarIcon,
  FileDown,
} from "lucide-react";
import React from "react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth, useUser } from "@clerk/nextjs";
import { useUserSubscription } from "@/app/hooks/use-user-subscription";
import { useSubscriptionModal } from "@/store/SubscriptionModalStore";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import jsPDF from "jspdf";

const formatUTCDate = (date: string | Date) => {
  const d = new Date(date);
  return format(
    new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
    "MMMM d, yyyy"
  );
};

const EarningsTranscript = () => {
  const transcriptId = useEarningsStore((state) => state.selectedTranscript);
  const setSelectedTranscript = useEarningsStore(
    (state) => state.setSelectedTranscript
  );
  const { isSignedIn } = useAuth();
  const { data: transcript, isLoading } = useGetTranscriptData(transcriptId);
  const { user } = useUser();
  console.log(user?.id);

  const { data: subscription } = useUserSubscription(user?.id);
  const subscriptionModal = useSubscriptionModal();

  console.log(subscription);

  console.log(transcript);
  // console.log(subscription);

  const handleBack = () => {
    setSelectedTranscript(null);
  };

  const handleDownloadPDF = () => {
    if (!transcript) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const lineHeight = 7;
    let yPosition = margin;

    // Helper function to add new page
    const addNewPage = () => {
      doc.addPage();
      yPosition = margin;
    };

    // Helper function to process text content
    const processTextContent = (
      text: string,
      xPos: number,
      maxWidth: number,
      isSpeakerName = false
    ) => {
      doc.setFont("helvetica", isSpeakerName ? "bold" : "normal");
      const lines = doc.splitTextToSize(text, maxWidth);

      lines.forEach((line: string, index: number) => {
        // Check if we need a new page
        if (yPosition + lineHeight > pageHeight - margin) {
          addNewPage();
          // Repeat speaker name on new page if this is content
          if (!isSpeakerName && index === 0) {
            const speakerName = text.split(":")[0] + ":";
            doc.setFont("helvetica", "bold");
            doc.text(speakerName, margin, yPosition);
            doc.setFont("helvetica", "normal");
            yPosition += lineHeight;
          }
        }

        doc.text(line, xPos, yPosition);
        yPosition += lineHeight;
      });

      // Add small spacing after paragraph
      yPosition += lineHeight * 0.5;
    };

    // Add header
    doc.setFontSize(16);
    doc.text(transcript.title || "Earnings Transcript", margin, yPosition);
    yPosition += lineHeight * 2;

    // Add metadata
    doc.setFontSize(10);
    const metadataLines = [
      `Date: ${formatUTCDate(transcript.scheduledAt)}`,
      `Time: ${transcript.MarketTime}`,
      transcript.financials?.epsActual &&
        `EPS: ${transcript.financials.epsActual} (Est: ${transcript.financials.epsEstimate})`,
      transcript.financials?.revenueActual &&
        `Revenue: ${formatCurrency(
          transcript.financials.revenueActual,
          true
        )} (Est: ${formatCurrency(
          transcript.financials.revenueEstimate || 0,
          true
        )})`,
    ].filter(Boolean);

    metadataLines.forEach((line) => {
      doc.text(line as string, margin, yPosition);
      yPosition += lineHeight;
    });

    // Add separator
    yPosition += lineHeight;
    doc.setLineWidth(0.2);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += lineHeight * 1.5;

    // Process transcript content
    if (transcript.fullText) {
      const paragraphs = transcript.fullText
        .split("\n")
        .filter((p) => p.trim())
        .map((p) => p.trim());

      paragraphs.forEach((paragraph) => {
        if (paragraph.includes(":")) {
          const [speaker, ...content] = paragraph.split(":");
          const speakerText = `${speaker.trim()}:`;

          // Calculate speaker width for proper content alignment
          doc.setFont("helvetica", "bold");
          const speakerWidth = doc.getTextWidth(speakerText) + 5;

          // Process speaker name
          processTextContent(speakerText, margin, pageWidth - margin * 2, true);

          // Process content with proper indentation
          const contentText = content.join(":").trim();
          const contentXPos = margin + speakerWidth;
          const contentWidth = pageWidth - margin * 2 - speakerWidth;

          processTextContent(contentText, contentXPos, contentWidth);
        } else {
          // Process regular paragraph
          processTextContent(paragraph, margin, pageWidth - margin * 2);
        }
      });
    }

    // Add page numbers
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128);
      doc.text(
        `Page ${i} of ${totalPages}`,
        pageWidth - margin,
        pageHeight - margin / 2,
        { align: "right" }
      );
    }

    // Save PDF
    doc.save(`${transcript.title || "earnings-transcript"}.pdf`);
  };

  if (isLoading) {
    return <TranscriptSkeleton />;
  }

  if (!transcript || !isSignedIn) return null;

  const hasActiveSubscription = subscription?.isActive;

  // Add check for scheduled status
  if (transcript.status === "SCHEDULED") {
    const scheduledDate = new Date(transcript.scheduledAt);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4 border-b border-gray-200 dark:border-slate-700 pb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            {transcript.company?.logo && (
              <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700">
                <Image
                  src={transcript.company.logo}
                  alt={`${transcript.company.name} logo`}
                  layout="fill"
                  objectFit="contain"
                  className="rounded-lg"
                />
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Q{transcript.quarter || "?"} {transcript.year || ""} Earnings
              </h2>
              <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <CalendarIcon className="w-3.5 h-3.5" />
                {formatUTCDate(transcript.scheduledAt)} •{" "}
                {transcript.MarketTime}
              </div>
            </div>
          </div>
        </div>

        {/* Financial Information Section */}
        {(transcript.financials?.epsEstimate ||
          transcript.financials?.revenueEstimate) && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Estimated EPS
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {transcript.financials?.epsEstimate
                    ? formatCurrency(transcript.financials.epsEstimate)
                    : "N/A"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Estimated Revenue
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {transcript.financials?.revenueEstimate
                    ? formatCurrency(
                        transcript.financials.revenueEstimate,
                        true
                      )
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty state message */}
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Upcoming Earnings Call
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            This earnings call is scheduled for {formatUTCDate(scheduledDate)}
          </p>
          <div className="text-sm text-gray-400 dark:text-gray-600 mb-6">
            The transcript will be available after the call has concluded
          </div>

          {/* Add subscription CTA if user doesn't have active subscription */}
          {!hasActiveSubscription && (
            <Button
              onClick={() => subscriptionModal.onOpen()}
              className="mt-4"
              variant="default"
            >
              Subscribe to Access Earnings Calls
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Split transcript into sections (this is a basic example - you might want to enhance this)
  const sections =
    transcript.fullText?.split("\n").filter((line) => line.trim()) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4 border-b border-gray-200 dark:border-slate-700 pb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          {transcript.company?.logo && (
            <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700">
              <Image
                src={transcript.company.logo}
                alt={`${transcript.company.name} logo`}
                layout="fill"
                objectFit="contain"
                className="rounded-lg"
              />
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {transcript.title}
            </h2>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                {formatUTCDate(transcript.scheduledAt)}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                {transcript.MarketTime}
              </div>
            </div>
          </div>
        </div>

        {/* Audio Link - only show if has active subscription */}
        {hasActiveSubscription && (
          <div className="flex gap-2">
            {transcript.audioUrl && (
              <a
                href={transcript.audioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-slate-800 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                Listen to Audio Recording
              </a>
            )}
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-slate-800 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <FileDown className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        )}
      </div>

      {/* Financial Results if available */}
      {(transcript.epsActual ||
        transcript.epsEstimate ||
        transcript.revenueActual ||
        transcript.revenueEstimate) && (
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">EPS</p>
            <div className="flex items-baseline gap-2">
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {transcript.epsActual
                  ? `$${transcript.epsActual.toFixed(2)}`
                  : "N/A"}
              </p>
              {transcript.epsEstimate && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  vs ${transcript.epsEstimate.toFixed(2)} est.
                </p>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Revenue</p>
            <div className="flex items-baseline gap-2">
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {transcript.revenueActual
                  ? `$${transcript.revenueActual.toFixed(2)}M`
                  : "N/A"}
              </p>
              {transcript.revenueEstimate && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  vs ${transcript.revenueEstimate.toFixed(2)}M est.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Transcript Content - Show subscription CTA if no active subscription */}
      {transcript.fullText && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Transcript
          </h3>

          {hasActiveSubscription ? (
            <div className="prose dark:prose-invert max-w-none space-y-4">
              {sections.map((section, index) => {
                const [speaker, ...content] = section.split(":");
                return (
                  <div key={index} className="space-y-2">
                    {content.length > 0 ? (
                      <>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {speaker.trim()}:
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          {content.join(":").trim()}
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-700 dark:text-gray-300">
                        {section}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
              <Lock className="w-12 h-12 text-gray-400 dark:text-gray-600" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Premium Content
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  Subscribe to access full earnings call transcripts and audio
                  recordings
                </p>
              </div>
              <Button
                onClick={() => subscriptionModal.onOpen()}
                className="mt-4"
                variant="default"
              >
                View Subscription Plans
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const TranscriptSkeleton = () => (
  <div className="space-y-6">
    {/* Header Skeleton */}
    <div className="space-y-4 border-b border-gray-200 dark:border-slate-700 pb-4">
      <div className="flex items-center gap-4">
        <div className="p-2">
          <Skeleton className="w-4 h-4" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-6 w-[300px]" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-4 w-[80px]" />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Financial Results Skeleton */}
    <div className="grid grid-cols-2 gap-6">
      <div>
        <Skeleton className="h-4 w-[60px] mb-2" />
        <div className="flex items-baseline gap-2">
          <Skeleton className="h-6 w-[100px]" />
          <Skeleton className="h-4 w-[80px]" />
        </div>
      </div>
      <div>
        <Skeleton className="h-4 w-[80px] mb-2" />
        <div className="flex items-baseline gap-2">
          <Skeleton className="h-6 w-[100px]" />
          <Skeleton className="h-4 w-[80px]" />
        </div>
      </div>
    </div>

    {/* Transcript Content Skeleton */}
    <div className="space-y-4">
      <Skeleton className="h-6 w-[100px]" />
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-24 w-full" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default EarningsTranscript;
