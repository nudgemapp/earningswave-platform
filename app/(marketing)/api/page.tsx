"use client";

import { motion } from "framer-motion";

const APIPage = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-12 py-20 md:py-32 text-center"
    >
      <div className="container flex max-w-[64rem] flex-col items-center gap-4 mx-auto">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
          className="font-bold text-4xl lg:text-5xl pb-4"
        >
          EarningsWave API
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xl text-muted-foreground"
        >
          Powered by AI for Intelligent Earnings Call Analysis
        </motion.p>
      </div>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 space-y-8"
      >
        <h2 className="text-2xl font-semibold">
          Revolutionize Your Earnings Call Insights
        </h2>
        <p className="text-muted-foreground lg:px-32">
          EarningsWave API leverages cutting-edge AI technology to provide deep,
          actionable insights from earnings calls. Our powerful tools help
          investors, analysts, and businesses make informed decisions based on
          comprehensive data analysis.
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          <a
            href="/api-docs"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2"
          >
            Explore API Documentation
          </a>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default APIPage;
