"use client";

import { motion } from "framer-motion";

const CoverageApiSection = () => {
  return (
    <div className="container mx-auto px-4 py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-[40px] font-bold tracking-tighter text-gray-900 dark:text-gray-100">
          Comprehensive Coverage
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Access extensive earnings data through our reliable API endpoints
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Transcripts & Audio Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-8 rounded-[24px] bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300"
        >
          <h3 className="text-2xl font-bold tracking-tight mb-8 text-gray-900 dark:text-gray-100">
            Transcripts & Audio
          </h3>
          <ul className="space-y-6">
            {[
              "15+ years of earnings call transcripts from US, and global markets",
              "200,000+ audio recordings for sentiment analysis",
              "Full participant lists to track analyst and executive presence",
              "Simple symbol lookup by name or ticker",
            ].map((item, index) => (
              <li
                key={index}
                className="flex items-center text-[16px] leading-relaxed text-gray-600 dark:text-gray-300"
              >
                <div className="w-2 h-2 rounded-full bg-primary mr-4" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Estimates & Performance Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="p-8 rounded-[24px] bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300"
        >
          <h3 className="text-2xl font-bold tracking-tight mb-8 text-gray-900 dark:text-gray-100">
            Estimates & Performance
          </h3>
          <ul className="space-y-6">
            {[
              "EPS and Revenue estimates from buy-side and sell-side analysts",
              "Non-GAAP figures that drive market reactions",
              "Historical and upcoming earnings calendar",
              "Actuals vs. estimates comparisons",
            ].map((item, index) => (
              <li
                key={index}
                className="flex items-center text-[16px] leading-relaxed text-gray-600 dark:text-gray-300"
              >
                <div className="w-2 h-2 rounded-full bg-primary mr-4" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default CoverageApiSection;
