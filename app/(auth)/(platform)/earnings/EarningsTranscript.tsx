import { X } from "lucide-react";
import Image from "next/image";
import React from "react";

interface TranscriptData {
  url: string;
  title: string;
  company_info: {
    company_name: string;
    ticker_symbol: string;
    ticker_change: string;
    date: string;
    time: string;
  };
  contents: string[];
  sections: {
    [key: string]: Array<{ name: string; text: string }>;
  };
  call_participants: string[];
}

interface EarningsTranscriptProps {
  transcriptData: TranscriptData;
  onBack: () => void;
}

const EarningsTranscript: React.FC<EarningsTranscriptProps> = ({
  transcriptData,
  onBack,
}) => {
  return (
    <div className="p-4 bg-white overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 mr-4 relative flex-shrink-0">
            <Image
              src={`https://logo.clearbit.com/oil.com`}
              alt={`${transcriptData.company_info.company_name} logo`}
              layout="fill"
              objectFit="contain"
            />
          </div>
          <h2 className="text-xl font-semibold">
            {transcriptData.company_info.company_name}
          </h2>
        </div>
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close transcript"
        >
          <X size={24} />
        </button>
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
          <div key={index} className="mb-2">
            <p className="font-semibold">{remark.name}</p>
            <p>{remark.text.substring(0, 100)}...</p>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Call Participants</h3>
        <ul className="list-disc pl-5">
          {transcriptData.call_participants.map((participant, index) => (
            <li key={index}>{participant}</li>
          ))}
        </ul>
      </div>

      <a
        href={transcriptData.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        Read Full Transcript
      </a>
    </div>
  );
};

export default EarningsTranscript;
