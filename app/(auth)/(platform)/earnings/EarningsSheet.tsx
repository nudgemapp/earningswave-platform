"use client";

import React from "react";
import EarningsTranscript from "./EarningsTranscript";
import EarningsFeed from "./EarningsFeed";
import { useEarningsStore } from "@/store/EarningsStore";
import { TranscriptData } from "./data";

interface EarningsTranscriptSheetProps {
  className?: string;
}

const EarningsTranscriptSheet: React.FC<EarningsTranscriptSheetProps> = ({
  className,
}) => {
  const { selectedCompany, setSelectedCompany } = useEarningsStore();

  const isSelectedCompany =
    TranscriptData.company_info.company_name === selectedCompany;

  return (
    <div className="h-screen p-4 overflow-y-auto bg-gray-100/80">
      {selectedCompany && isSelectedCompany ? (
        <EarningsTranscript
          transcriptData={TranscriptData}
          onBack={() => setSelectedCompany(null)}
        />
      ) : (
        <EarningsFeed
          earnings={[TranscriptData.company_info]}
          onSelectCompany={setSelectedCompany}
        />
      )}
    </div>
  );
};

export default EarningsTranscriptSheet;
