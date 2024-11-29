"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

// Define company logos - you'll need to add your actual company logos
const COMPANY_LOGOS = [
  // Row 1
  [
    "/images/AMZN.png",
    "/images/META.png",
    "/images/NVDA.png",
    "/images/RKLB.png",
    "/images/TSLA.png",
    "/images/HIMS.png",
    "/images/MSTR.png",
    "/images/SOFI.png",
    "/images/GME.png",
  ],
  // Row 2
  [
    "/images/CELH.png",
    "/images/CRWD.png",
    "/images/PLTR.png",
    "/images/HOOD.png",
    "/images/COIN.png",
    "/images/CRM.png",
    "/images/SNOW.png",
    "/images/ASTS.png",
    "/images/LUNR.png",
  ],
  // Row 3
  [
    "/images/AFRM.png",
    "/images/AMC.png",
    "/images/AAPL.png",
    "/images/NFLX.jpg",
    "/images/UBER.png",
    "/images/GTLB.png",
    "/images/PYPL.png",
    "/images/DKNG.png",
    "/images/MARA.png",
  ],
];

const CarouselSection = () => {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Only start animation after component mount to avoid SSR issues
  useEffect(() => {
    setShouldAnimate(true);
  }, []);

  return (
    <div className="w-full py-20 overflow-hidden bg-white dark:bg-slate-800">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-bold mb-8 text-black dark:text-white tracking-tight">
          Complete Earnings Coverage
        </h2>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-16 max-w-2xl mx-auto leading-relaxed">
          Use it in your own projects, to train your models, test your strategy,
          and analyze your results.
        </p>
      </div>

      {[0, 1, 2].map((rowIndex) => (
        <div
          key={rowIndex}
          className="relative flex overflow-hidden my-12"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
          }}
        >
          <motion.div
            className="flex gap-12 items-center"
            initial={{
              x: rowIndex === 1 ? "0%" : "-50%", // middle row starts from right
            }}
            animate={
              shouldAnimate
                ? {
                    x: rowIndex === 1 ? "-100%" : "0%", // middle row moves left, others right
                  }
                : {}
            }
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear",
              repeatType: "mirror", // changed from "loop" to "mirror"
            }}
          >
            {/* Triple the logos instead of double to ensure no gaps */}
            {[
              ...COMPANY_LOGOS[rowIndex],
              ...COMPANY_LOGOS[rowIndex],
              ...COMPANY_LOGOS[rowIndex],
            ].map((logo, index) => (
              <div
                key={`${index}-original`}
                className="flex-shrink-0 w-48 h-24 relative"
              >
                <Image
                  src={logo}
                  alt="Company logo"
                  fill
                  className="object-contain filter dark:invert-[0.85] opacity-70 hover:opacity-100 transition-opacity"
                  loading="lazy"
                />
              </div>
            ))}
          </motion.div>
        </div>
      ))}
    </div>
  );
};

export default CarouselSection;
