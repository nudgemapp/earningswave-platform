import { Company } from "@prisma/client";
import {
  Building2,
  Globe,
  Phone,
  Calendar,
  DollarSign,
  Users,
  Building,
} from "lucide-react";

interface InfoTabProps {
  company: Company;
}

const InfoTab: React.FC<InfoTabProps> = ({ company }) => {
  const formatMarketCap = (marketCap: number | null | undefined) => {
    if (!marketCap) return "N/A";
    if (marketCap >= 1000) {
      return `$${(marketCap / 1000).toFixed(2)}B`;
    }
    return `$${marketCap.toFixed(2)}M`;
  };

  const formatShares = (shares: number | null | undefined) => {
    if (!shares) return "N/A";
    if (shares >= 1000) {
      return `${(shares / 1000).toFixed(2)}B`;
    }
    return `${shares.toFixed(2)}M`;
  };

  const infoSections = [
    {
      title: "Trading Information",
      items: [
        {
          icon: Building,
          label: "Exchange",
          value: company.exchange || "N/A",
        },
        {
          icon: DollarSign,
          label: "Market Cap",
          value: formatMarketCap(company.marketCapitalization),
        },
        {
          icon: Users,
          label: "Shares Outstanding",
          value: formatShares(company.sharesOutstanding),
        },
        {
          icon: Calendar,
          label: "IPO Date",
          value: company.ipo
            ? new Date(company.ipo).toLocaleDateString()
            : "N/A",
        },
      ],
    },
    {
      title: "Company Details",
      items: [
        {
          icon: Building2,
          label: "Industry",
          value: company.finnhubIndustry || "N/A",
        },
        {
          icon: Globe,
          label: "Country",
          value: company.country || "N/A",
        },
        {
          icon: Globe,
          label: "Website",
          value: company.weburl || "N/A",
          isLink: true,
        },
        {
          icon: Phone,
          label: "Phone",
          value: company.phone || "N/A",
        },
      ],
    },
  ];

  return (
    <div className="space-y-4 py-2">
      {infoSections.map((section) => (
        <div key={section.title} className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 px-2">
            {section.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 px-2">
            {section.items.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2.5 p-2.5 rounded-lg bg-gray-50 dark:bg-slate-800/50"
              >
                <div className="flex-shrink-0">
                  <item.icon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {item.label}
                  </p>
                  {item.isLink && item.value !== "N/A" ? (
                    <a
                      href={
                        item.value.startsWith("http")
                          ? item.value
                          : `https://${item.value}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate block"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-gray-100 truncate">
                      {item.value}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {company.description && (
        <div className="space-y-2 px-2">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Description
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-slate-800/50 rounded-lg p-2.5">
            {company.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default InfoTab;
