import React from "react";
import { Calendar, ChartBar, FileText } from "lucide-react";

const WelcomeMessage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">
        Welcome to EarningsWave
      </h2>
      <p className="text-xl text-gray-600 mb-8">
        Select a company to view earnings transcripts or future earnings
        reports.
      </p>
      <div className="grid grid-rows-1 md:grid-rows-3 gap-8">
        <FeatureCard
          icon={<Calendar className="w-12 h-12 text-blue-500" />}
          title="Upcoming Earnings"
          description="View scheduled earnings reports for companies you're interested in."
        />
        <FeatureCard
          icon={<FileText className="w-12 h-12 text-green-500" />}
          title="Earnings Transcripts"
          description="Access detailed transcripts from past earnings calls."
        />
        <FeatureCard
          icon={<ChartBar className="w-12 h-12 text-purple-500" />}
          title="Financial Analysis"
          description="Gain insights from comprehensive financial data and reports."
        />
      </div>
    </div>
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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default WelcomeMessage;
