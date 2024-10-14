import CallToAction from "@/components/CallToAction";
import FAQsection from "@/components/FAQsection";
import FooterSection from "@/components/FooterSection";
import HeroSection from "@/components/HeroSection";
import NavBar from "@/components/NavBar";
// import MarqueeSection from "@/components/MarqueeSection";
// import ProductSection from "@/components/ProductSection";
// import AlertSection from "@/components/AlertSection";

export default function Home() {
  return (
    <main>
      {/* <div className="flex flex-col-reverse md:flex-col">
        <AlertSection />
      </div> */}
      <div className="sticky top-0 z-50">
        <NavBar />
      </div>
      <div className="pt-20">
        <HeroSection />
      </div>
      <div className="mt-8 md:mt-[81px] flex flex-col gap-12 md:gap-[150px] px-4 md:px-[100px]">
        {/* <MarqueeSection /> */}
        {/* <CRMSection /> */}
        {/* <DataModellingSection /> */}
        {/* <ProductSection /> */}
        <FAQsection />
        {/* <SecurityScaleSection /> */}
      </div>

      <div className="mt-8 md:mt-[81px] flex flex-col">
        {/* <MoreFeaturesSection /> */}
        {/* <LovedByBuildersSection /> */}
        {/* <ReadyToBuildSection /> */}
        <CallToAction />
        <FooterSection />
      </div>
    </main>
  );
}
