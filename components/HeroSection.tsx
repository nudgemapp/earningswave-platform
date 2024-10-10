"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import HeroHeaderSection from "./HeroHeaderSection";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { EmailModal } from "./modals/email-modal";

function HeroSection() {
  const router = useRouter();

  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);

  const isInView1 = useInView(ref1, { once: false });
  const isInView2 = useInView(ref2, { once: false });
  const isInView3 = useInView(ref3, { once: false });

  return (
    <section className="mt-24 sm:mt-0">
      <HeroHeaderSection />
      <div>
        <motion.div
          ref={ref1}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={cn(
            "text-center text-5xl leading-tight md:text-[64px] md:leading-[72px] font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-5 my-8",
            "px-4 md:px-8 lg:px-20 xl:px-32 max-w-[1000px] mx-auto"
          )}
        >
          Your competitive edge in earnings analysis
        </motion.div>

        <motion.p
          ref={ref2}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-[18px] sm:text-[22px] leading-[28px] sm:leading-[30px] tracking-tight text-[#010D3E] mt-5 mb-8 font-medium sm:font-normal"
        >
          Navigate earnings season with ease. Our user-friendly
          <br className="hidden sm:inline" />
          interface and guided analysis tools make it simple to
          <br className="hidden sm:inline" /> extract valuable insights from
          boring and lengthy earnings reports.
        </motion.p>

        <motion.div
          ref={ref3}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex gap-[12px] justify-center"
        >
          <Button
            className="border-none rounded-[12px]"
            onClick={() => router.push("/sign-up")}
          >
            Sign up{" "}
          </Button>
          <EmailModal />
        </motion.div>

        {/* <div className="flex w-full justify-center">
          <HeroYoutubeModal />
        </div> */}
      </div>
    </section>
  );
}

export default HeroSection;
