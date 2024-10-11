import FooterSection from "@/components/FooterSection";
import NavBar from "@/components/NavBar";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-50">
        <NavBar />
      </div>
      <div className="flex-grow">{children}</div>
      <FooterSection />
    </main>
  );
};

export default MarketingLayout;
