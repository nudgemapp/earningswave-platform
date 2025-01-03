"use client";

import { useEarningsStore } from "@/store/EarningsStore";
import { useGetCompany } from "@/app/hooks/use-get-company";
import { Transcript } from "@prisma/client";

// Type-safe helper functions
const formatDate = (dateString: string | Date | null | undefined): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatCurrency = (value: number | null | undefined): string => {
  if (typeof value !== "number") return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};

interface InfoRowProps {
  label: string;
  value: string;
}

interface InfoSectionProps {
  title: string;
  children: React.ReactNode;
}

// Helper components with proper typing
const InfoSection: React.FC<InfoSectionProps> = ({ title, children }) => (
  <div className="space-y-2">
    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
      {title}
    </h2>
    <div className="space-y-1">{children}</div>
  </div>
);

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-500 dark:text-gray-400">{label}</span>
    <span className="text-gray-900 dark:text-gray-100">{value}</span>
  </div>
);

const QuoteClient = ({ params }: { params: { symbol: string } }) => {
  const selectedCompany = useEarningsStore((state) => state.selectedCompany);
  const companyId = selectedCompany?.companyId;
  const { data: company } = useGetCompany(params.symbol, "symbol");

  if (!company) return null;

  // Safe access to the most recent transcript
  const latestTranscript = company.recentTranscripts?.[0] as
    | Transcript
    | undefined;

  return (
    <div className="flex-1 grid grid-cols-12 gap-4 p-4">
      {/* Left Column - Chart */}
      <div className="col-span-4 bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
        {/* <StockChartContainer symbol={company.symbol} /> */}
      </div>

      {/* Middle Column - Company Info */}
      <div className="col-span-5 bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
        <div className="space-y-6">
          {/* Company Header */}
          <div className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-slate-700">
            <img
              src={company.logo || "/default-company-logo.png"}
              alt={company.name || "Company logo"}
              className="w-12 h-12 rounded-lg"
            />
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {company.name || company.symbol}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {company.symbol} • {company.exchange || "N/A"}
              </p>
            </div>
          </div>

          {/* Company Details */}
          <div className="space-y-4">
            <InfoSection title="Company Overview">
              <InfoRow
                label="Industry"
                value={company.finnhubIndustry || "N/A"}
              />
              <InfoRow
                label="Market Cap"
                value={formatCurrency(
                  company.marketCapitalization
                    ? company.marketCapitalization * 1000000
                    : null
                )}
              />
              <InfoRow label="Country" value={company.country || "N/A"} />
              <InfoRow label="IPO Date" value={formatDate(company.ipo)} />
            </InfoSection>

            {latestTranscript && (
              <InfoSection title="Latest Earnings">
                <InfoRow
                  label="Date"
                  value={formatDate(latestTranscript.scheduledAt)}
                />
                <InfoRow
                  label="EPS Actual"
                  value={latestTranscript.epsActual?.toString() || "N/A"}
                />
                <InfoRow
                  label="EPS Estimate"
                  value={latestTranscript.epsEstimate?.toString() || "N/A"}
                />
                <InfoRow
                  label="Revenue Actual"
                  value={formatCurrency(latestTranscript.revenueActual || null)}
                />
              </InfoSection>
            )}
          </div>
        </div>
      </div>

      {/* Right Column - News */}
      <div className="col-span-3 bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Latest News
        </h2>
        {/* News content will go here */}
      </div>
    </div>
  );
};

export default QuoteClient;
