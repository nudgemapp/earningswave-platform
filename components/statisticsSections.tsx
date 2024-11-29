"use client";

import { motion, useMotionValue, useInView, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const StatisticItem = ({
  endValue,
  label,
  prefix = "",
  suffix = "",
}: {
  endValue: number;
  label: string;
  prefix?: string;
  suffix?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const count = useMotionValue(0);
  const [displayNumber, setDisplayNumber] = useState(0);

  useEffect(() => {
    if (isInView) {
      const animation = animate(count, endValue, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (latest) => {
          setDisplayNumber(Math.round(latest));
        },
      });

      return animation.stop;
    }
  }, [isInView, endValue, count]);

  return (
    <div ref={ref} className="flex flex-col items-center">
      <motion.span
        className="text-4xl xl:text-5xl 2xl:text-6xl font-bold text-gray-900 mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {prefix}
        {displayNumber.toLocaleString()}
        {suffix}
      </motion.span>
      <motion.span
        className="text-gray-600 text-lg"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {label}
      </motion.span>
    </div>
  );
};

const StatisticsSection = () => {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="bg-gray-100 py-16"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <StatisticItem endValue={7} label="of Audio" suffix="TB+" />
          <StatisticItem endValue={7892} label="Tickers" />
          <StatisticItem endValue={112729} label="Transcripts" suffix="+" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatisticsSection;
