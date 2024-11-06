import FooterSection from "@/components/FooterSection";
import NavBar from "@/components/NavBar";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex flex-col min-h-screen bg-white dark:bg-slate-900">
      <div className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
        <NavBar />
      </div>
      <div className="flex-grow">{children}</div>
      <div className="border-t border-gray-200 dark:border-slate-700">
        <FooterSection />
      </div>
    </main>
  );
};

export default MarketingLayout;
