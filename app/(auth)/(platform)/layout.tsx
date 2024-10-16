import EarningsTranscriptSheet from "./earnings/EarningsSheet";

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen">
      <div className="w-2/3">{children}</div>
      <div className="w-1/3 border-l border-gray-200">
        <EarningsTranscriptSheet transcriptData={{
          _id: {
            $oid: ""
          },
          href: "",
          date: "",
          title: "",
          company_info: {
            company_name: "",
            ticker_symbol: "",
            ticker_change: "",
            date: "",
            time: "",
            logo_base64: ""
          },
          contents: [],
          sections: {},
          call_participants: [],
          full_text: ""
        }} />
      </div>
    </main>
  );
};

export default PlatformLayout;
