import { TranscriptData } from "./earnings/data";
import EarningsTranscriptSheet from "./earnings/EarningsSheet";

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen">
      <div className="w-2/3">{children}</div>
      <div className="w-1/3 border-l border-gray-200">
        <EarningsTranscriptSheet transcriptData={TranscriptData} />
      </div>
    </main>
  );
};

export default PlatformLayout;
