"use client";

import { Separator } from "@/components/ui/separator";
import { EarningsCallTranscript } from "@/types/EarningsTranscripts";
import Image from "next/image";
import React from "react";

// import { X } from "lucide-react";

interface EarningsTranscriptProps {
  transcriptData: EarningsCallTranscript;
  // onBack: () => void;
}

const EarningsTranscript: React.FC<EarningsTranscriptProps> = ({
  transcriptData,
  // onBack,
}) => {
  return (
    <div className="p-4 bg-white overflow-y-auto">
      <div className="flex flex-col items-start mb-4">
        <div className="text-2xl font-bold mb-4">EarningsWave coming soon</div>
        <Separator className="mb-4" />
        <div className="flex items-center mt-4">
          <div className="w-12 h-12 mr-4 relative flex-shrink-0">
            <Image
              src={transcriptData.company_info.logo_base64}
              alt={`${transcriptData.company_info.company_name} logo`}
              layout="fill"
              objectFit="contain"
            />
          </div>
          <h2 className="text-xl font-semibold">
            {transcriptData.company_info.company_name}
          </h2>
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-4">{transcriptData.title}</h2>

      <div className="mb-4">
        <p>
          <strong>Company:</strong> {transcriptData.company_info.company_name}
        </p>
        <p>
          <strong>Ticker:</strong> {transcriptData.company_info.ticker_symbol} (
          {transcriptData.company_info.ticker_change})
        </p>
        <p>
          <strong>Date:</strong> {transcriptData.company_info.date}
        </p>
        <p>
          <strong>Time:</strong> {transcriptData.company_info.time}
        </p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Contents</h3>
        <ul className="list-disc pl-5">
          {transcriptData.contents.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Prepared Remarks</h3>
        {transcriptData.sections["Prepared Remarks"].map((remark, index) => (
          <div key={index} className="mb-4">
            <p className="font-semibold">{remark.name}</p>
            <p>{remark.text}</p>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Questions and Answers</h3>
        {transcriptData.sections["Questions and Answers"].map((qa, index) => (
          <div key={index} className="mb-4">
            <p className="font-semibold">{qa.name}</p>
            <p>{qa.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EarningsTranscript;
