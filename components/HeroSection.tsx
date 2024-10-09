"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import HeroHeaderSection from "./HeroHeaderSection";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

function HeroSection() {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);

  const isInView1 = useInView(ref1, { once: false });
  const isInView2 = useInView(ref2, { once: false });
  const isInView3 = useInView(ref3, { once: false });

  return (
    <section>
      <HeroHeaderSection />
      <div>
        <motion.div
          ref={ref1}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={cn(
            "text-4xl md:text-[92px] text-center text-primary md:leading-[5.5rem] my-8"
          )}
        >
          Powerful APIs for <br /> Financial Insights
        </motion.div>

        <motion.p
          ref={ref2}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8 text-[22px] text-center text-[#31373D]"
        >
          Powerful, flexible and data-driven, EarningsWave makes it easy to
          analyse financial data.
        </motion.p>

        <motion.div
          ref={ref3}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex gap-[12px] justify-center"
        >
          <Button className="border-none rounded-[12px]">Start for free</Button>
          <Button className="rounded-[12px] border-[1px] border-[#EDEEF0] bg-white hover:bg-white text-[#31373D]">
            Talk to sales
          </Button>
        </motion.div>

        {/* <div className="flex w-full justify-center">
          <HeroYoutubeModal />
        </div> */}
      </div>
    </section>
  );
}

export default HeroSection;
