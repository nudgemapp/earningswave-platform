import CallToAction from "@/components/CallToAction";
import FAQsection from "@/components/FAQsection";
import PricingSection from "@/components/PricingSection";
// import HeroSection from "@/components/HeroSection";
// import MarqueeSection from "@/components/MarqueeSection";
// import ProductSection from "@/components/ProductSection";

export default function Home() {
  return (
    <main className="bg-white dark:bg-slate-900">
      {/* <div className="flex flex-col-reverse md:flex-col">
        <AlertSection />
      </div>
      <div className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
        <NavBar />
      </div> */}
      {/* <div className="pt-20 bg-white dark:bg-slate-900">
        <HeroSection />
      </div> */}
      <div className="mt-8 md:mt-[81px] flex flex-col gap-12 md:gap-[150px] px-4 md:px-[100px] bg-white dark:bg-slate-900">
        {/* <MarqueeSection /> */}
        {/* <CRMSection /> */}
        {/* <DataModellingSection /> */}
        {/* <ProductSection /> */}
        <PricingSection />
        <FAQsection />
        {/* <SecurityScaleSection /> */}
      </div>

      <div className="mt-8 md:mt-[81px] flex flex-col bg-white dark:bg-slate-900">
        {/* <MoreFeaturesSection /> */}
        {/* <LovedByBuildersSection /> */}
        {/* <ReadyToBuildSection /> */}
        <CallToAction />
      </div>
    </main>
  );
}
