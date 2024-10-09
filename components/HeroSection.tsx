import React from "react";
import HeroHeaderSection from "./HeroHeaderSection";
import { cn } from "@/lib/utils";
// import { gilroyBold } from "@/lib/utils";
import { Button } from "./ui/button";

function HeroSection() {
  return (
    <section>
      <HeroHeaderSection />
      <div>
        <div
          className={cn(
            // gilroyBold.className,
            "text-4xl md:text-[92px] text-center text-primary md:leading-[5.5rem] my-8"
          )}
        >
          Powerful APIs for <br /> Financial Insights
        </div>

        <p className="mb-8 text-[22px] text-center text-[#31373D]">
          Powerful, flexible and data-driven, EarningsWave makes it easy to
          analyse financial data.
        </p>

        <div className="flex gap-[12px] justify-center">
          <Button className="border-none rounded-[12px]">Start for free</Button>
          <Button className="rounded-[12px] border-[1px] border-[#EDEEF0] bg-white hover:bg-white text-[#31373D]">
            Talk to sales
          </Button>
        </div>

        {/* <div className="flex w-full justify-center">
          <HeroYoutubeModal />
        </div> */}
      </div>
    </section>
  );
}

export default HeroSection;
