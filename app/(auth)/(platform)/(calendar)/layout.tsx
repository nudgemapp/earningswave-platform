import EarningsTranscriptSheet from "./earnings/components/EarningsSheet";

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen bg-white dark:bg-slate-900">
      <div className="w-full md:w-2/3">{children}</div>
      <div className="hidden md:block w-full md:w-1/3 md:border-l md:border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-slate-800/50">
        <EarningsTranscriptSheet />
      </div>
    </main>
  );
};

export default PlatformLayout;
