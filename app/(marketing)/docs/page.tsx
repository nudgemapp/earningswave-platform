"use client";

import { Button } from "@/components/ui/button";
import { useEmailModal } from "@/store/EmailModalStore";
import { motion } from "framer-motion";

const DocsPage = () => {
  const emailModal = useEmailModal();

  const features = [
    "Weekly Earnings Calendar",
    "Earnings Estimates & Actuals",
    "Live or Replay Earnings Calls",
    "Quarterly Call Transcripts",
    "AI Summaries of Investor Calls",
    "Earnings Alerts to Email or SMS",
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-12 pb-32 text-center pt-32"
    >
      <div className="container flex max-w-[64rem] flex-col items-center gap-4 mx-auto">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
          className="font-bold text-4xl lg:text-5xl pb-4"
        >
          EarningsWave
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xl text-muted-foreground"
        >
          Your All-in-One Earnings Intelligence Platform
        </motion.p>
      </div>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 space-y-8"
      >
        <h2 className="text-2xl font-semibold">
          Comprehensive Earnings Insights at Your Fingertips
        </h2>
        <p className="text-muted-foreground">
          Stay ahead of the market with our powerful suite of earnings-related
          tools and features. From real-time updates to AI-powered analysis,
          EarningsWave provides everything you need to make informed investment
          decisions.
        </p>
        <motion.ul className="space-y-4 mt-8">
          {features.map((feature, index) => (
            <motion.li
              key={index}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
              className="text-lg font-medium"
            >
              {feature}
            </motion.li>
          ))}
        </motion.ul>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block mt-8"
        >
          <Button
            className="border-none rounded-[12px] text-lg sm:text-2xl py-3 px-6 sm:py-6 sm:px-12 shadow-lg hover:shadow-xl transition-shadow duration-300"
            onClick={() => emailModal.onOpen()}
          >
            Get Started with EarningsWave
          </Button>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default DocsPage;
