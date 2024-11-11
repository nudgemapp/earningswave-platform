import React from "react";
import { Calendar, ChartBar, FileText } from "lucide-react";
import { usePathname } from "next/navigation";
import TickerSearch from "@/components/tickerSearch";
import Logo from "@/components/Logo";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const WelcomeMessage: React.FC = () => {
  const pathname = usePathname();
  const showSearch = pathname.includes("/");

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 pb-8 max-w-6xl mx-auto bg-white dark:bg-slate-900"
    >
      <motion.div variants={itemVariants}>
        <Logo className="w-36 h-36 mb-4 -translate-y-[-20px]" />
      </motion.div>

      <motion.h2
        variants={itemVariants}
        className="text-3xl font-semibold mb-3 text-gray-900 dark:text-gray-100"
      >
        Welcome to EarningsWave
      </motion.h2>

      <motion.p
        variants={itemVariants}
        className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl text-center"
      >
        Select a company to view earnings transcripts or future earnings reports
      </motion.p>

      {showSearch && (
        <motion.div variants={itemVariants} className="w-full max-w-3xl">
          <TickerSearch />
        </motion.div>
      )}

      <motion.div
        variants={itemVariants}
        className="flex flex-col gap-4 w-full max-w-3xl"
      >
        <FeatureCard
          icon={
            <Calendar className="w-6 h-6 text-blue-500 dark:text-blue-400" />
          }
          title="Upcoming Earnings"
          description="View scheduled earnings reports for companies you're interested in."
        />
        <FeatureCard
          icon={
            <FileText className="w-6 h-6 text-green-500 dark:text-green-400" />
          }
          title="Earnings Transcripts"
          description="Access detailed transcripts from past earnings calls."
        />
        <FeatureCard
          icon={
            <ChartBar className="w-6 h-6 text-purple-500 dark:text-purple-400" />
          }
          title="Financial Analysis"
          description="Gain insights from comprehensive financial data and reports."
        />
      </motion.div>
    </motion.div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 transition-all duration-200 shadow-sm dark:shadow-slate-800/50"
    >
      <div className="flex items-center gap-4">
        <div className="p-2 bg-gray-50 dark:bg-slate-900 rounded-lg">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeMessage;
