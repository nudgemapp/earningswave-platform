import { motion } from "framer-motion";
import { MessageCircleIcon } from "lucide-react";
import Link from "next/link";
import Logo from "../Logo";

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-8"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
        <Logo height={240} width={240} />
        <p>
          Welcome to EarningsWave - your comprehensive platform for analyzing
          NASDAQ and NYSE listed companies. Access detailed{" "}
          <span className="font-medium">
            earnings transcripts, financial data, historical prices,
          </span>{" "}
          and market sentiment analysis all in one place.
        </p>
        <p>
          Our platform provides real-time insights and analytics to help you
          make informed investment decisions. Track company performance, analyze
          market trends, and stay updated with the latest financial information.
        </p>
        <p>
          Get started by searching for a company or exploring our featured
          analysis tools in the dashboard.
        </p>
      </div>
    </motion.div>
  );
};
