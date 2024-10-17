import React, { useState, useEffect } from "react";
import Image from "next/image";

import { Calendar } from "lucide-react";
// import { companyNames } from "@/app/(auth)/(platform)/earnings/data";
import { equals, filter, path, pipe } from "ramda";
import { useEarningsStore } from "@/store/EarningsStore";

interface MonthViewProps {
  currentDate: Date;
}
export type EarningsCallTranscript = {
  _id: {
    $oid: string;
  };
  href: string;
  date: string;
  title: string;
  company_info: {
    company_name: string;
    ticker_symbol: string;
    ticker_change: string;
    date: string;
    time: string;
    logo_base64: string;
  };
  contents: string[];
  sections: Record<string, SectionDetail[]>;
  call_participants: string[];
  full_text: string;
};

type SectionDetail = {
  name: string;
  role: string | null;
  text: string;
};
const MonthView: React.FC<MonthViewProps> = ({ currentDate }) => {
  const [renderedDays, setRenderedDays] = useState<Date[]>([]);
  const [transcripts, setTranscripts] = useState<EarningsCallTranscript[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const setSelectedCompany = useEarningsStore(
    (state) => state.setSelectedCompany
  );
  const fetchTranscripts = async () => {
    try {
      const month = currentDate.getMonth() + 1; // getMonth() returns 0-11, so we add 1
      const year = currentDate.getFullYear();
      const response = await fetch(
        `/api/transcripts?month=${month}&year=${year}&page=${currentPage}`
      ).then((res) => res.json());

      setTranscripts(response.articles);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Failed to fetch transcripts:", error);
    }
  };

 

  useEffect(() => {
    fetchTranscripts();
    setRenderedDays(getDaysInMonth(currentDate));
  }, [currentDate]);

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days: Date[] = [];

    // Add padding days from previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(new Date(year, month, -firstDayOfMonth + i + 1));
    }

    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    // Remove padding days from next month
    return days.slice(0, firstDayOfMonth + daysInMonth);
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getLogosForDate = (
    date: Date,
    transcripts: EarningsCallTranscript[]
  ) => {
    // Extract the date in the format "MMM DD YYYY"
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

    // Filter transcripts for the given date
    const matchingTranscripts = filter(
      pipe((transcript) => {
        const transcriptDate = path(["company_info", "date"], transcript);
        return equals(transcriptDate, formattedDate);
      }),
      transcripts
    );

    if (matchingTranscripts.length > 0) {
      return matchingTranscripts;
    }
    return [];
  };

  const seedRandom = (seed: number) => {
    let x = Math.sin(seed) * 10000;
    return () => {
      x = Math.sin(x) * 10000;
      return x - Math.floor(x);
    };
  };

  const NoEarnings = () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 border border-gray-200 rounded-sm">
      <div className="flex flex-row items-center space-y-1 gap-2">
        <Calendar className="w-6 h-6 text-gray-400" />
        <span className="text-xs font-medium text-gray-500">No earnings</span>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="grid grid-cols-7 py-2 bg-gray-100">
        {weekDays.map((day) => (
          <div
            key={day}
            className="bg-gray-100 py-1 text-center text-xs text-gray-600 font-bold"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 flex-grow">
        {renderedDays.map((date, index) => {
          const dayContent = getLogosForDate(date, transcripts);
          return (
            <div
              key={index}
              className={`bg-white p-1 text-center flex flex-col ${
                date.getMonth() !== currentDate.getMonth()
                  ? "text-gray-400"
                  : "text-gray-800"
              } ${
                date.toDateString() === new Date().toDateString()
                  ? "bg-blue-100"
                  : ""
              }`}
            >
              <span className="text-xs">{date.getDate()}</span>
              <div className="flex-grow flex flex-wrap justify-center items-center mt-1">
                {dayContent.length === 0 ? (
                  <div className="w-full h-full">
                    <NoEarnings />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1 w-full h-full">
                    {dayContent.map((transcriptInfo, logoIndex) => (
                      <div
                        key={logoIndex}
                        className="aspect-square sm:w-8 sm:h-8 relative bg-white border border-gray-200 rounded-sm overflow-hidden transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-lg hover:z-10 cursor-pointer"
                        onClick={() =>
                          setSelectedCompany({
                            name: transcriptInfo.company_info.company_name,
                            id: transcriptInfo._id,
                          })
                        }
                      >
                        <Image
                          src={transcriptInfo.company_info.logo_base64}
                          alt={`${transcriptInfo.company_info.company_name} logo`}
                          layout="fill"
                          objectFit="contain"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;
