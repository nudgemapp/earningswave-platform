"use client";

import React from "react";
import EarningsTranscript from "./EarningsTranscript";
// import { useEarningsStore } from "@/store/EarningsStore";
import { TranscriptData } from "./data";

interface EarningsTranscriptSheetProps {
  className?: string;
}

const EarningsTranscriptSheet: React.FC<EarningsTranscriptSheetProps> = (
  {
    // className,
  }
) => {
  // const { selectedCompany, setSelectedCompany } = useEarningsStore();

  return (
    <div className="h-screen p-4 overflow-y-auto bg-gray-100/80">
      <EarningsTranscript
        transcriptData={TranscriptData}
        // onBack={() => setSelectedCompany(null)}
      />
    </div>
  );
};

export default EarningsTranscriptSheet;

// return (
//   <div className="h-screen p-4 overflow-y-auto bg-gray-100/80">
//     {selectedCompany && isSelectedCompany ? (
//       <EarningsTranscript
//         transcriptData={TranscriptData}
//         onBack={() => setSelectedCompany(null)}
//       />
//     ) : (
//       <EarningsFeed
//         earnings={[TranscriptData.company_info]}
//         onSelectCompany={setSelectedCompany}
//       />
//     )}
//   </div>
// );
