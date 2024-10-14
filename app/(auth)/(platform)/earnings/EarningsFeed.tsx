import React from "react";
import Image from "next/image";

interface EarningsFeedProps {
  earnings: Array<{
    company_name: string;
    ticker_symbol: string;
    date: string;
    time: string;
  }>;
  onSelectCompany: (companyName: string) => void;
}

const EarningsFeed: React.FC<EarningsFeedProps> = ({
  earnings,
  onSelectCompany,
}) => {
  return (
    <div className="h-screen p-4 bg-white overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Earnings Feed</h2>
      {earnings.map((earning, index) => (
        <div
          key={index}
          className="flex items-center mb-4 p-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => onSelectCompany(earning.company_name)}
        >
          <div className="w-10 h-10 mr-3 relative flex-shrink-0">
            <Image
              src={`https://logo.clearbit.com/oil.com`}
              alt={`${earning.company_name} logo`}
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div>
            <h3 className="font-semibold">
              {earning.company_name} ({earning.ticker_symbol})
            </h3>
            <p className="text-sm text-gray-600">
              {earning.date} at {earning.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EarningsFeed;
