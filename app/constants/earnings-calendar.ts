interface CalendarEntry {
  symbol: string;
  marketTime?: "BMO" | "AMC"; // Before Market Open or After Market Close
  earningsTime?: string;
  confirmed?: boolean; // Optional: if the date is confirmed
  earningsEstimate?: string;
  revenueEstimate?: string;
  revenueGrowth?: string;
  sentiment?: string;
  score?: string;
  averageMove?: string;
  impliedMove?: string;
}

type EarningsCalendar = {
  [date: string]: CalendarEntry[];
};

export const EARNINGS_CALENDAR: EarningsCalendar = {
  "2024-12-16": [
    // Before Market Open (BMO)
    { symbol: "ZDGE", marketTime: "BMO" },
    { symbol: "ESOA", marketTime: "BMO" },
    { symbol: "CNTM", marketTime: "BMO" },
    { symbol: "BRN", marketTime: "BMO" },
    // After Market Close (AMC)
    { symbol: "OPTT", marketTime: "AMC" },
    { symbol: "BCTX", marketTime: "AMC" },
    { symbol: "ARKR", marketTime: "AMC" },
    { symbol: "AMTM", marketTime: "AMC" },
    { symbol: "RICK", marketTime: "AMC" },
    { symbol: "QIPT", marketTime: "AMC" },
    { symbol: "MITK", marketTime: "AMC" },
    { symbol: "NCPL", marketTime: "AMC" },
    { symbol: "STRM", marketTime: "AMC" },
    { symbol: "RCAT", marketTime: "AMC" },
    { symbol: "MAMA", marketTime: "AMC" },
    { symbol: "CMP", marketTime: "AMC" },
    { symbol: "USAU", marketTime: "AMC" },
    { symbol: "ENZ", marketTime: "AMC" },
    { symbol: "MSS", marketTime: "AMC" },
    { symbol: "HSCS", marketTime: "AMC" },
    { symbol: "LTRY", marketTime: "AMC" },
  ],
  "2024-12-17": [
    // Before Market Open (BMO)
    { symbol: "ZJK", marketTime: "BMO" },
    { symbol: "REE", marketTime: "BMO" },
    { symbol: "CMCM", marketTime: "BMO" },
    { symbol: "PFX", marketTime: "BMO" },
    { symbol: "EPIX", marketTime: "BMO" },
    { symbol: "NMTC", marketTime: "BMO" },
    { symbol: "PETZ", marketTime: "BMO" },
    { symbol: "SONN", marketTime: "BMO" },
    // After Market Close (AMC)
    { symbol: "HEI", marketTime: "AMC" },
    { symbol: "HEI.A", marketTime: "AMC" },
    { symbol: "WOR", marketTime: "AMC" },
    { symbol: "ELP", marketTime: "AMC" },
    { symbol: "APDN", marketTime: "AMC" },
  ],
  "2024-12-18": [
    // Before Market Open (BMO)
    { symbol: "GIS", marketTime: "BMO" }, // Confirmed 7:00 AM ET
    { symbol: "JBL", marketTime: "BMO" }, // Confirmed 7:45 AM ET
    { symbol: "BIRK", marketTime: "BMO" }, // Confirmed 5:20 AM ET
    { symbol: "TTC", marketTime: "BMO" }, // Confirmed 8:30 AM ET
    { symbol: "ABM", marketTime: "BMO" }, // Confirmed 6:58 AM ET
    { symbol: "LDTC", marketTime: "BMO" }, // Confirmed 7:30 AM ET
    { symbol: "TKLF", marketTime: "BMO" }, // Confirmed 6:00 AM ET
    { symbol: "OGI", marketTime: "BMO" }, // Confirmed 6:00 AM ET
    // After Market Close (AMC)
    { symbol: "MU", marketTime: "AMC" }, // Confirmed 4:02 PM ET
    { symbol: "LEN", marketTime: "AMC" }, // Confirmed 4:30 PM ET
    { symbol: "LEN.B", marketTime: "AMC" }, // Confirmed 4:30 PM ET
    { symbol: "SCS", marketTime: "AMC" }, // Confirmed 4:05 PM ET
    { symbol: "WS", marketTime: "AMC" }, // Confirmed 4:10 PM ET
    { symbol: "EPAC", marketTime: "AMC" }, // Confirmed 4:30 PM ET
    { symbol: "MLKN", marketTime: "AMC" }, // Confirmed 4:05 PM ET
    { symbol: "NRSN", marketTime: "AMC" }, // Added
    { symbol: "YCBD", marketTime: "AMC" }, // Added
    { symbol: "BACK", marketTime: "AMC" }, // Added
  ],
  "2024-12-19": [
    // Before Market Open (BMO)
    { symbol: "ACN", marketTime: "BMO" }, // Confirmed 6:39 AM ET
    { symbol: "CTAS", marketTime: "BMO" }, // Confirmed 8:30 AM ET
    { symbol: "PAYX", marketTime: "BMO" }, // Confirmed 8:30 AM ET
    { symbol: "DRI", marketTime: "BMO" }, // Confirmed 7:00 AM ET
    { symbol: "FDS", marketTime: "BMO" }, // Confirmed 7:00 AM ET
    { symbol: "FCEL", marketTime: "BMO" }, // Confirmed 7:30 AM ET
    { symbol: "KMX", marketTime: "BMO" }, // Confirmed 6:50 AM ET
    { symbol: "CAG", marketTime: "BMO" }, // Confirmed 7:30 AM ET
    { symbol: "LW", marketTime: "BMO" }, // Confirmed 6:00 AM ET
    { symbol: "SHCO", marketTime: "BMO" }, // Added - Confirmed 8:01 AM ET
    // After Market Close (AMC)
    { symbol: "NKE", marketTime: "AMC" }, // Confirmed 4:15 PM ET
    { symbol: "FDX", marketTime: "AMC" }, // Confirmed 4:04 PM ET
    { symbol: "BB", marketTime: "AMC" }, // Confirmed 5:05 PM ET
    { symbol: "AVO", marketTime: "AMC" }, // Confirmed 4:05 PM ET
    { symbol: "SCHL", marketTime: "AMC" }, // Confirmed 4:01 PM ET
    { symbol: "ISSC", marketTime: "AMC" }, // Confirmed 4:05 PM ET
    { symbol: "MOBX", marketTime: "AMC" }, // Confirmed 4:00 PM ET
  ],
  "2024-12-20": [
    // Before Market Open (BMO)
    { symbol: "CCL", marketTime: "BMO" }, // Confirmed 9:15 AM ET
    { symbol: "WGO", marketTime: "BMO" }, // Confirmed 7:00 AM ET
    { symbol: "CUK", marketTime: "BMO" }, // Confirmed 9:15 AM ET
    { symbol: "SATX", marketTime: "BMO" }, // Confirmed 8:00 AM ET
    { symbol: "CSPI", marketTime: "BMO" }, // Added - Confirmed 8:30 AM ET
  ],
  "2024-12-23": [
    // Before Market Open (BMO)
    { symbol: "AVXL", marketTime: "BMO" }, // Confirmed 7:30 AM ET
    { symbol: "EBF", marketTime: "BMO" }, // Confirmed 6:00 AM ET
    { symbol: "OCC", marketTime: "BMO" }, // Confirmed 8:15 AM ET
    // After Market Close (AMC)
    { symbol: "LMNR", marketTime: "AMC" }, // Confirmed 4:05 PM ET
    { symbol: "BLIN", marketTime: "AMC" }, // Confirmed 4:07 PM ET
  ],
  "2024-12-24": [{ symbol: "NONE", marketTime: "BMO" }],
  "2024-12-26": [{ symbol: "NONE", marketTime: "BMO" }],
  "2024-12-27": [{ symbol: "AMTM", marketTime: "BMO" }],
  "2024-12-30": [
    // Before Market Open (BMO)
    { symbol: "NNE", marketTime: "BMO" }, // Confirmed 8:00 AM ET
    { symbol: "PMEC", marketTime: "BMO" }, // Confirmed 6:54 AM ET
    { symbol: "KUKE", marketTime: "BMO" }, // Confirmed 8:00 AM ET
    // After Market Close (AMC)
    { symbol: "ELLO", marketTime: "AMC" }, // Confirmed 4:15 PM ET
    { symbol: "DGLY", marketTime: "AMC" }, // Confirmed 12:30 PM ET
  ],
  "2024-12-31": [
    // Before Market Open (BMO)
    { symbol: "BTI", marketTime: "BMO" }, // Confirmed 8:44 AM ET
    { symbol: "ZJK", marketTime: "BMO" }, // Confirmed 4:35 AM ET
    { symbol: "FUND", marketTime: "BMO" }, // Confirmed 7:00 AM ET
    { symbol: "HOLO", marketTime: "BMO" }, // Confirmed 7:00 AM ET
    { symbol: "SVMH", marketTime: "BMO" }, // Confirmed 9:01 AM ET
    { symbol: "DSY", marketTime: "BMO" }, // Confirmed 6:14 AM ET
    { symbol: "EUDA", marketTime: "BMO" }, // Confirmed 5:31 AM ET
    { symbol: "INCR", marketTime: "BMO" }, // Confirmed 8:00 AM ET
    { symbol: "PMEC", marketTime: "BMO" }, // Confirmed 6:54 AM ET
    { symbol: "JDZG", marketTime: "BMO" }, // Confirmed 8:22 AM ET
    { symbol: "KUKE", marketTime: "BMO" }, // Confirmed 8:00 AM ET
    { symbol: "ABTS", marketTime: "BMO" }, // Confirmed 2:21 AM ET
    { symbol: "UBXG", marketTime: "BMO" }, // Confirmed 5:04 AM ET
    { symbol: "JL", marketTime: "BMO" }, // Confirmed 4:46 AM ET
    { symbol: "AMBO", marketTime: "BMO" }, // Confirmed 5:42 AM ET
    { symbol: "LICN", marketTime: "BMO" }, // Confirmed 1:27 AM ET
    { symbol: "ELWS", marketTime: "BMO" }, // Confirmed 3:19 AM ET
    { symbol: "WLDS", marketTime: "BMO" }, // Confirmed 1:32 AM ET
    { symbol: "ICON", marketTime: "BMO" }, // Confirmed 5:16 AM ET
    { symbol: "FRES", marketTime: "BMO" }, // Confirmed 3:00 AM ET
    // After Market Close (AMC)
    { symbol: "ATGL", marketTime: "AMC" }, // Confirmed 5:30 PM ET
    { symbol: "ATHE", marketTime: "AMC" }, // Confirmed 4:13 PM ET
    { symbol: "SPPL", marketTime: "AMC" }, // Confirmed 10:06 AM ET
    { symbol: "ABVE", marketTime: "AMC" }, // Confirmed 11:01 PM ET
    { symbol: "NTRP", marketTime: "AMC" }, // Confirmed 4:00 PM ET
    { symbol: "SMX", marketTime: "AMC" }, // Confirmed 5:09 PM ET
  ],
  "2025-01-02": [
    {
      symbol: "RGP",
      marketTime: "AMC",
      earningsEstimate: "-$0.04",
      revenueEstimate: "$136.63 Mil",
    }, // Confirmed 4:05 PM ET
    {
      symbol: "LFCR",
      marketTime: "AMC",
      earningsEstimate: "-$0.27",
      revenueEstimate: "$29.70 Mil",
    }, // Confirmed 4:05 PM ET
  ],
  "2025-01-03": [{ symbol: "NONE", marketTime: "BMO" }],
  "2025-01-06": [
    // Before Market Open (BMO)
    {
      symbol: "CMC",
      marketTime: "BMO",
      earningsTime: "06:30", // Store in 24-hour format without timezone
      earningsEstimate: "$0.78",
      revenueEstimate: "$1.89 Bil",
      revenueGrowth: "-5.6%",
    }, // Confirmed 6:30 AM ET
  ],
  "2025-01-07": [
    // Before Market Open (BMO)
    {
      symbol: "RPM",
      marketTime: "BMO",
      earningsEstimate: "$1.35",
      revenueEstimate: "$1.78 Bil",
      revenueGrowth: "-0.7%",
    }, // Confirmed 6:45 AM ET
    {
      symbol: "APOG",
      marketTime: "BMO",
      earningsEstimate: "$1.14",
    }, // Confirmed 6:30 AM ET
    {
      symbol: "LNN",
      marketTime: "BMO",
      earningsEstimate: "$1.34",
      revenueEstimate: "$165.83 Mil",
      revenueGrowth: "2.8%",
    }, // Confirmed 6:45 AM ET
    // After Market Close (AMC)
    {
      symbol: "AZZ",
      marketTime: "AMC",
      earningsEstimate: "$1.27",
      revenueEstimate: "$400.28 Mil",
      revenueGrowth: "4.9%",
    }, // Confirmed 4:15 PM ET
    {
      symbol: "AIR",
      marketTime: "AMC",
      earningsEstimate: "$0.82",
      revenueEstimate: "$652.62 Mil",
      revenueGrowth: "19.7%",
    }, // Confirmed 4:05 PM ET
    {
      symbol: "CALM",
      marketTime: "AMC",
    }, // Confirmed 4:05 PM ET
    {
      symbol: "SLP",
      marketTime: "AMC",
      earningsEstimate: "$0.17",
      revenueEstimate: "$18.69 Mil",
      revenueGrowth: "28.9%",
    }, // Confirmed 4:05 PM ET
    {
      symbol: "KRUS",
      marketTime: "AMC",
      earningsEstimate: "$-0.23",
      revenueEstimate: "$61.67 Mil",
      revenueGrowth: "19.8%",
    }, // Confirmed 4:05 PM ET
  ],
  "2025-01-08": [
    // Before Market Open (BMO)
    {
      symbol: "SMPL",
      marketTime: "BMO",
      earningsTime: "7:00 AM ET",
      earningsEstimate: "$0.43",
      revenueEstimate: "$348.07 Mil",
      revenueGrowth: "12.8%",
    }, // Confirmed 7:00 AM ET - Est: $0.43 EPS, Rev: $348.07M (+12.8%)
    {
      symbol: "HELE",
      marketTime: "BMO",
      earningsTime: "6:45 AM ET",
      earningsEstimate: "$2.38",
      revenueEstimate: "$530.38 Mil",
      revenueGrowth: "-3.5%",
    }, // Confirmed 6:45 AM ET - Est: $2.38 EPS, Rev: $530.38M (-3.5%)
    {
      symbol: "ANGO",
      marketTime: "BMO",
      earningsTime: "6:30 AM ET",
      earningsEstimate: "$-0.11",
      revenueEstimate: "$71.17 Mil",
      revenueGrowth: "-10.0%",
    }, // Confirmed 6:30 AM ET - Est: -$0.11 EPS, Rev: $71.17M (-10.0%)
    {
      symbol: "MSM",
      marketTime: "BMO",
      earningsTime: "6:30 AM ET",
      earningsEstimate: "$0.73",
      revenueEstimate: "$905.01 Mil",
      revenueGrowth: "-5.1%",
    }, // Confirmed 6:30 AM ET - Est: $0.73 EPS, Rev: $905.01M (-5.1%)
    {
      symbol: "UNF",
      marketTime: "BMO",
      earningsTime: "8:00 AM ET",
      earningsEstimate: "$2.27",
      revenueEstimate: "$604.83 Mil",
      revenueGrowth: "1.9%",
    }, // Confirmed 8:00 AM ET - Est: $2.27 EPS, Rev: $604.83M (+1.9%)
    {
      symbol: "ACI",
      marketTime: "BMO",
      earningsTime: "8:30 AM ET",
      earningsEstimate: "$0.64",
      revenueEstimate: "$18.80 Bil",
      revenueGrowth: "1.3%",
    }, // Confirmed 8:30 AM ET - Est: $0.64 EPS, Rev: $18.80B (+1.3%)
    {
      symbol: "RDUS",
      marketTime: "BMO",
      earningsTime: "8:00 AM ET",
      earningsEstimate: "$-0.66",
      revenueEstimate: "$648.30 Mil",
      revenueGrowth: "-3.7%",
    }, // Confirmed 8:00 AM ET - Est: -$0.66 EPS, Rev: $648.30M (-3.7%)
    // After Market Close (AMC)
    {
      symbol: "JEF",
      marketTime: "AMC",
      earningsTime: "4:15 PM ET",
      earningsEstimate: "$0.85",
      revenueEstimate: "$1.75 Bil",
      revenueGrowth: "46.2%",
    }, // Confirmed 4:15 PM ET - Est: $0.85 EPS, Rev: $1.75B (+46.2%)
    {
      symbol: "SAR",
      marketTime: "AMC",
      earningsTime: "4:05 PM ET",
      earningsEstimate: "$0.82",
      revenueEstimate: "$34.85 Mil",
      revenueGrowth: "-4.1%",
    }, // Confirmed 4:05 PM ET - Est: $0.82 EPS, Rev: $34.85M (-4.1%)
    {
      symbol: "PENG",
      marketTime: "AMC",
      earningsTime: "4:05 PM ET",
      earningsEstimate: "$0.26",
      revenueEstimate: "$317.00 Mil",
      revenueGrowth: "-",
    }, // Confirmed 4:05 PM ET - Est: $0.26 EPS, Rev: $317.00M
    {
      symbol: "GBX",
      marketTime: "AMC",
      earningsTime: "4:15 PM ET",
      earningsEstimate: "$1.16",
      revenueEstimate: "-",
      revenueGrowth: "-",
    }, // Confirmed 4:15 PM ET - Est: $1.16 EPS
    {
      symbol: "FC",
      marketTime: "AMC",
      earningsTime: "4:05 PM ET",
      earningsEstimate: "$0.22",
      revenueEstimate: "$70.04 Mil",
      revenueGrowth: "2.4%",
    }, // Confirmed 4:05 PM ET - Est: $0.22 EPS, Rev: $70.04M (+2.4%)
    {
      symbol: "PCYO",
      marketTime: "AMC",
      earningsTime: "4:05 PM ET",
      earningsEstimate: "-",
      revenueEstimate: "-",
      revenueGrowth: "-",
    }, // Confirmed 4:05 PM ET
  ],
  "2025-01-09": [
    // Before Market Open (BMO)
    {
      symbol: "WBA",
      marketTime: "BMO",
      earningsEstimate: "$0.37",
      revenueEstimate: "$37.10B",
      revenueGrowth: "1.1%",
    }, // Confirmed 7:00 AM ET
    {
      symbol: "TLRY",
      marketTime: "BMO",
      earningsEstimate: "$-0.04",
      revenueEstimate: "$218.22M",
      revenueGrowth: "12.6%",
    }, // Confirmed 7:00 AM ET
    {
      symbol: "STZ",
      marketTime: "BMO",
      earningsEstimate: "$3.34",
      revenueEstimate: "$2.55B",
      revenueGrowth: "-4.1%",
    }, // Confirmed 7:30 AM ET
    {
      symbol: "AYI",
      marketTime: "BMO",
      earningsEstimate: "$3.87",
      revenueEstimate: "$952.18M",
      revenueGrowth: "1.9%",
    }, // Confirmed 6:00 AM ET
    {
      symbol: "NEOG",
      marketTime: "BMO",
      earningsEstimate: "$0.11",
      revenueEstimate: "$226.37M",
      revenueGrowth: "-1.4%",
    }, // Confirmed 7:00 AM ET
    {
      symbol: "NTIC",
      marketTime: "BMO",
      earningsEstimate: "$0.10",
      revenueEstimate: "$22.20M",
      revenueGrowth: "10.0%",
    }, // Confirmed 8:00 AM ET
    // After Market Close (AMC)
    {
      symbol: "KBH",
      marketTime: "AMC",
      earningsEstimate: "$2.45",
      revenueEstimate: "$1.99B",
      revenueGrowth: "18.9%",
    }, // Confirmed 4:10 PM ET
    {
      symbol: "PSMT",
      marketTime: "AMC",
      earningsEstimate: "$1.43",
      revenueEstimate: "$5.29B",
      revenueGrowth: "353.5%",
    }, // Confirmed 4:01 PM ET
    {
      symbol: "WDFC",
      marketTime: "AMC",
      earningsEstimate: "$1.28",
      revenueEstimate: "$625.00M",
      revenueGrowth: "345.1%",
    }, // Confirmed 4:05 PM ET
    {
      symbol: "ACCD",
      marketTime: "AMC",
      earningsEstimate: "$-0.31",
      revenueEstimate: "$106.00M",
      revenueGrowth: "6.7%",
    }, // Confirmed 4:05 PM ET
    {
      symbol: "BBCP",
      marketTime: "AMC",
      earningsEstimate: "$0.14",
      revenueEstimate: "$110.10M",
      revenueGrowth: "-8.4%",
    }, // Confirmed 4:05 PM ET
    {
      symbol: "ETWO",
      marketTime: "AMC",
      earningsEstimate: "$0.05",
      revenueEstimate: "$150.09M",
      revenueGrowth: "-4.7%",
    }, // Confirmed 4:15 PM ET
    {
      symbol: "TTAN",
      marketTime: "AMC",
    }, // Confirmed 6:00 PM ET
  ],
  "2025-01-10": [
    // Before Market Open (BMO)
    {
      symbol: "DAL",
      marketTime: "BMO",
      earningsEstimate: "$1.76",
      revenueEstimate: "$14.99 Bil",
      revenueGrowth: "5.4%",
      confirmed: true,
      earningsTime: "06:30",
    }, // Confirmed 6:30 AM ET
    {
      symbol: "WBA",
      marketTime: "BMO",
      earningsEstimate: "$0.37",
      revenueEstimate: "$37.10 Bil",
      revenueGrowth: "1.1%",
      confirmed: true,
      earningsTime: "07:00",
    }, // Confirmed 7:00 AM ET
    {
      symbol: "SNX",
      marketTime: "BMO",
      earningsEstimate: "$2.84",
      revenueEstimate: "$15.29 Bil",
      revenueGrowth: "6.1%",
      confirmed: true,
      earningsTime: "08:05",
    }, // Confirmed 8:05 AM ET
  ],
  "2025-01-13": [
    {
      symbol: "AEHR",
      marketTime: "AMC",
      earningsEstimate: "$0.01",
      revenueEstimate: "$14.60 Mil",
      revenueGrowth: "-31.9%",
    },
  ],
  "2025-01-14": [
    {
      symbol: "APLD",
      marketTime: "AMC",
      earningsEstimate: "-$0.14",
      revenueEstimate: "$63.65 Mil",
      revenueGrowth: "50.8%",
    },
    {
      symbol: "CVGW",
      marketTime: "AMC",
      earningsEstimate: "$0.25",
      revenueEstimate: "$166.00 Mil",
      revenueGrowth: "-31.2%",
    },
  ],
  "2025-01-15": [
    // Before Market Open (BMO)
    {
      symbol: "JPM",
      marketTime: "BMO",
      earningsTime: "6:55 AM ET",
      earningsEstimate: "$3.86",
      revenueEstimate: "$40.48 Bil",
      revenueGrowth: "-34.6%",
    },
    {
      symbol: "C",
      marketTime: "BMO",
      earningsTime: "8:00 AM ET",
      earningsEstimate: "$1.23",
      revenueEstimate: "$19.50 Bil",
      revenueGrowth: "-51.2%",
    },
    {
      symbol: "WFC",
      marketTime: "BMO",
      earningsTime: "7:00 AM ET",
      earningsEstimate: "$1.33",
      revenueEstimate: "$20.50 Bil",
      revenueGrowth: "-32.9%",
    },
    {
      symbol: "BK",
      marketTime: "BMO",
      earningsTime: "6:35 AM ET",
      earningsEstimate: "$1.52",
      revenueEstimate: "$4.63 Bil",
      revenueGrowth: "-49.5%",
    },
    // After Market Close (AMC)
    {
      symbol: "SNV",
      marketTime: "AMC",
      earningsTime: "7:35 PM ET",
      earningsEstimate: "$1.14",
      revenueEstimate: "$569.21 Mil",
      revenueGrowth: "-32.2%",
    },
    {
      symbol: "FUL",
      marketTime: "AMC",
      earningsTime: "4:05 PM ET",
      earningsEstimate: "$1.26",
      revenueEstimate: "$937.17 Mil",
      revenueGrowth: "3.8%",
    },
    {
      symbol: "HOMB",
      marketTime: "AMC",
      earningsTime: "5:15 PM ET",
      earningsEstimate: "$0.54",
      revenueEstimate: "$254.67 Mil",
      revenueGrowth: "-27.0%",
    },
  ],
  "2025-01-16": [
    // Before Market Open (BMO)
    {
      symbol: "TSM",
      marketTime: "BMO",
      earningsTime: "02:00",
      earningsEstimate: "$2.16",
      revenueEstimate: "$26.38 Bil",
      revenueGrowth: "34.4%",
    },
    {
      symbol: "UNH",
      marketTime: "BMO",
      earningsTime: "05:55",
      earningsEstimate: "$6.74",
      revenueEstimate: "$101.88 Bil",
      revenueGrowth: "7.9%",
    },
    {
      symbol: "GS",
      marketTime: "BMO",
      earningsTime: "07:30",
      earningsEstimate: "$7.94",
      revenueEstimate: "$11.96 Bil",
      revenueGrowth: "-58.0%",
    },
    {
      symbol: "BAC",
      marketTime: "BMO",
      earningsTime: "06:45",
      earningsEstimate: "$0.79",
      revenueEstimate: "$25.18 Bil",
      revenueGrowth: "-42.3%",
    },
    {
      symbol: "MS",
      marketTime: "BMO",
      earningsTime: "07:40",
      earningsEstimate: "$1.58",
      revenueEstimate: "$14.35 Bil",
      revenueGrowth: "-42.7%",
    },
    {
      symbol: "PNC",
      marketTime: "BMO",
      earningsTime: "06:35",
      earningsEstimate: "$3.29",
      revenueEstimate: "$5.44 Bil",
      revenueGrowth: "-35.7%",
    },
    {
      symbol: "USB",
      marketTime: "BMO",
      earningsTime: "06:45",
      earningsEstimate: "$1.06",
      revenueEstimate: "$6.98 Bil",
      revenueGrowth: "-32.8%",
    },
    {
      symbol: "FHN",
      marketTime: "BMO",
      earningsTime: "06:30",
      earningsEstimate: "$0.38",
      revenueEstimate: "$817.80 Mil",
      revenueGrowth: "-35.6%",
    },
    {
      symbol: "INFY",
      marketTime: "BMO",
      earningsTime: "08:20",
      earningsEstimate: "$0.20",
      revenueEstimate: "$4.90 Bil",
      revenueGrowth: "5.1%",
    },
    {
      symbol: "MTB",
      marketTime: "BMO",
      earningsTime: "05:15",
      earningsEstimate: "$3.71",
      revenueEstimate: "$2.32 Bil",
      revenueGrowth: "-30.1%",
    },
    {
      symbol: "IIIN",
      marketTime: "BMO",
      earningsTime: "06:30",
      earningsEstimate: "-$0.03",
      revenueEstimate: "$118.75 Mil",
      revenueGrowth: "-2.4%",
    },
    // After Market Close (AMC)
    {
      symbol: "OZK",
      marketTime: "AMC",
      earningsTime: "16:00",
      earningsEstimate: "$1.46",
      revenueEstimate: "$406.18 Mil",
      revenueGrowth: "-36.8%",
    },
    {
      symbol: "RFIL",
      marketTime: "AMC",
      earningsEstimate: "$0.04",
      revenueEstimate: "$17.85 Mil",
      revenueGrowth: "12.4%",
    },
  ],
  "2025-01-17": [
    // Before Market Open (BMO)
    {
      symbol: "SLB",
      marketTime: "BMO",
      earningsTime: "06:50",
      earningsEstimate: "$0.91",
      revenueEstimate: "$9.26 Bil",
      revenueGrowth: "3.0%",
    },
    {
      symbol: "RF",
      marketTime: "BMO",
      earningsTime: "06:00",
      earningsEstimate: "$0.55",
      revenueEstimate: "$1.85 Bil",
      revenueGrowth: "-20.6%",
    },
    {
      symbol: "FAST",
      marketTime: "BMO",
      earningsTime: "06:50",
      earningsEstimate: "$0.48",
      revenueEstimate: "$1.85 Bil",
      revenueGrowth: "5.2%",
    },
    {
      symbol: "TFC",
      marketTime: "BMO",
      earningsTime: "06:00",
      earningsEstimate: "$0.88",
      revenueEstimate: "$5.02 Bil",
      revenueGrowth: "-40.4%",
    },
    {
      symbol: "CFG",
      marketTime: "BMO",
      earningsTime: "06:20",
      earningsEstimate: "$0.82",
      revenueEstimate: "$1.97 Bil",
      revenueGrowth: "-38.0%",
    },
    {
      symbol: "STT",
      marketTime: "BMO",
      earningsEstimate: "$2.34",
      revenueEstimate: "$3.28 Bil",
      revenueGrowth: "-33.8%",
    },
    {
      symbol: "WIT",
      marketTime: "BMO",
      earningsTime: "09:40",
      earningsEstimate: "$0.04",
      revenueEstimate: "$2.59 Bil",
      revenueGrowth: "-3.0%",
    },
  ],
  "2025-01-20": [{ symbol: "NONE", marketTime: "BMO" }],
  "2025-01-21": [
    // Before Market Open (BMO)
    {
      symbol: "FITB",
      marketTime: "BMO",
      earningsTime: "06:30",
      earningsEstimate: "$0.88",
      revenueEstimate: "$2.21 Bil",
      revenueGrowth: "-34.8%",
    },
    {
      symbol: "DHI",
      marketTime: "BMO",
      earningsTime: "06:30",
      earningsEstimate: "$2.39",
      revenueEstimate: "$7.87 Bil",
      revenueGrowth: "1.9%",
    },
    {
      symbol: "FOR",
      marketTime: "BMO",
      earningsTime: "06:30",
      revenueEstimate: "$1.62 Bil",
      revenueGrowth: "429.6%",
    },
    {
      symbol: "KEY",
      marketTime: "BMO",
      earningsTime: "06:30",
      earningsEstimate: "$0.33",
      revenueEstimate: "$1.71 Bil",
      revenueGrowth: "-35.7%",
    },
    {
      symbol: "CBU",
      marketTime: "BMO",
      earningsTime: "06:45",
      earningsEstimate: "$0.90",
      revenueEstimate: "$190.45 Mil",
      revenueGrowth: "-11.0%",
    },
    {
      symbol: "EDU",
      marketTime: "BMO",
      earningsTime: "05:00",
      earningsEstimate: "$0.36",
      revenueEstimate: "$1.03 Bil",
      revenueGrowth: "18.4%",
    },
    {
      symbol: "PEBO",
      marketTime: "BMO",
      earningsTime: "06:00",
      earningsEstimate: "$0.75",
      revenueEstimate: "$111.45 Mil",
      revenueGrowth: "-25.4%",
    },
    {
      symbol: "PLD",
      marketTime: "BMO",
      earningsTime: "08:00",
      earningsEstimate: "$1.38",
      revenueEstimate: "$1.94 Bil",
      revenueGrowth: "2.7%",
    },
    {
      symbol: "UMC",
      marketTime: "BMO",
      earningsTime: "06:35",
      earningsEstimate: "$0.13",
      revenueEstimate: "$1.85 Bil",
      revenueGrowth: "3.4%",
    },
    // After Market Close (AMC)
    {
      symbol: "NFLX",
      marketTime: "AMC",
      earningsTime: "16:00",
      earningsEstimate: "$4.21",
      revenueEstimate: "$10.15 Bil",
      revenueGrowth: "14.9%",
    },
    {
      symbol: "IBKR",
      marketTime: "AMC",
      earningsTime: "16:00",
      earningsEstimate: "$1.70",
      revenueEstimate: "$1.28 Bil",
      revenueGrowth: "-39.2%",
    },
    {
      symbol: "ZION",
      marketTime: "AMC",
      earningsTime: "16:10",
      earningsEstimate: "$1.25",
      revenueEstimate: "$794.96 Mil",
      revenueGrowth: "-33.1%",
    },
    {
      symbol: "COF",
      marketTime: "AMC",
      earningsTime: "16:05",
      earningsEstimate: "$2.67",
      revenueEstimate: "$9.98 Bil",
      revenueGrowth: "-24.0%",
    },
    {
      symbol: "HWC",
      marketTime: "AMC",
      earningsTime: "16:00",
      earningsEstimate: "$1.29",
      revenueEstimate: "$363.38 Mil",
      revenueGrowth: "-22.0%",
    },
    {
      symbol: "SFNC",
      marketTime: "AMC",
      earningsEstimate: "$0.35",
      revenueEstimate: "$203.90 Mil",
      revenueGrowth: "-41.0%",
    },
  ],
  "2025-01-22": [
    // Before Market Open (BMO)
    {
      symbol: "PG",
      marketTime: "BMO",
      earningsTime: "06:55",
      earningsEstimate: "$1.88",
      revenueEstimate: "$21.77 Bil",
      revenueGrowth: "1.5%",
    },
    {
      symbol: "ABT",
      marketTime: "BMO",
      earningsTime: "07:30",
      earningsEstimate: "$1.34",
      revenueEstimate: "$10.87 Bil",
      revenueGrowth: "6.1%",
    },
    {
      symbol: "HAL",
      marketTime: "BMO",
      earningsTime: "06:45",
      earningsEstimate: "$0.70",
      revenueEstimate: "$5.71 Bil",
      revenueGrowth: "-0.5%",
    },
    {
      symbol: "JNJ",
      marketTime: "BMO",
      earningsTime: "06:20",
      earningsEstimate: "$2.00",
      revenueEstimate: "$22.52 Bil",
      revenueGrowth: "5.3%",
    },
    {
      symbol: "ALLY",
      marketTime: "BMO",
      earningsTime: "07:25",
      earningsEstimate: "$0.63",
      revenueEstimate: "$2.11 Bil",
      revenueGrowth: "2.1%",
    },
    {
      symbol: "CMA",
      marketTime: "BMO",
      earningsTime: "06:35",
      earningsEstimate: "$1.25",
      revenueEstimate: "$832.68 Mil",
      revenueGrowth: "-33.2%",
    },
    {
      symbol: "APH",
      marketTime: "BMO",
      earningsTime: "08:00",
      earningsEstimate: "$0.50",
      revenueEstimate: "$4.02 Bil",
      revenueGrowth: "20.8%",
    },
    {
      symbol: "FCCO",
      marketTime: "BMO",
      earningsTime: "09:00",
      earningsEstimate: "$0.50",
      revenueEstimate: "$16.85 Mil",
      revenueGrowth: "-28.3%",
    },
    {
      symbol: "TRV",
      marketTime: "BMO",
      earningsTime: "06:55",
      earningsEstimate: "$6.39",
      revenueEstimate: "$11.93 Bil",
      revenueGrowth: "9.2%",
    },
    {
      symbol: "OFG",
      marketTime: "BMO",
      earningsTime: "07:30",
      earningsEstimate: "$0.97",
      revenueEstimate: "$174.40 Mil",
      revenueGrowth: "-16.3%",
    },
    {
      symbol: "TXT",
      marketTime: "BMO",
      earningsTime: "06:30",
      earningsEstimate: "$1.31",
      revenueEstimate: "$3.83 Bil",
      revenueGrowth: "-1.6%",
    },
    // After Market Close (AMC)
    {
      symbol: "AA",
      marketTime: "AMC",
      earningsTime: "16:25",
      earningsEstimate: "$0.91",
      revenueEstimate: "$3.03 Bil",
      revenueGrowth: "16.8%",
    },
    {
      symbol: "DFS",
      marketTime: "AMC",
      earningsTime: "16:20",
      earningsEstimate: "$2.83",
      revenueEstimate: "$4.44 Bil",
      revenueGrowth: "-20.7%",
    },
    {
      symbol: "SLG",
      marketTime: "AMC",
      earningsTime: "16:15",
      earningsEstimate: "$1.58",
      revenueEstimate: "$140.04 Mil",
      revenueGrowth: "-33.9%",
    },
    {
      symbol: "STLD",
      marketTime: "AMC",
      earningsTime: "16:30",
      earningsEstimate: "$1.41",
      revenueEstimate: "$4.06 Bil",
      revenueGrowth: "-4.1%",
    },
    {
      symbol: "BANR",
      marketTime: "AMC",
      earningsTime: "16:00",
      earningsEstimate: "$1.22",
      revenueEstimate: "$153.95 Mil",
      revenueGrowth: "-22.2%",
    },
    {
      symbol: "EQBK",
      marketTime: "AMC",
      earningsTime: "17:20",
      earningsEstimate: "$0.92",
      revenueEstimate: "$56.15 Mil",
      revenueGrowth: "168.9%",
    },
    {
      symbol: "HXL",
      marketTime: "AMC",
      earningsTime: "16:15",
      earningsEstimate: "$0.51",
      revenueEstimate: "$485.88 Mil",
      revenueGrowth: "6.2%",
    },
    {
      symbol: "WDS",
      marketTime: "AMC",
      earningsTime: "18:00",
    },
  ],
  "2025-01-23": [
    // Before Market Open (BMO)
    {
      symbol: "GE",
      marketTime: "BMO",
      earningsTime: "06:30",
      earningsEstimate: "$1.03",
      revenueEstimate: "$9.55 Bil",
      revenueGrowth: "-50.8%",
    },
    {
      symbol: "HBAN",
      marketTime: "BMO",
      earningsTime: "07:00",
      earningsEstimate: "$0.31",
      revenueEstimate: "$1.87 Bil",
      revenueGrowth: "-32.1%",
    },
    {
      symbol: "AUB",
      marketTime: "BMO",
      earningsTime: "06:00",
      earningsEstimate: "$0.79",
      revenueEstimate: "$220.63 Mil",
      revenueGrowth: "-23.8%",
    },
    {
      symbol: "IBCP",
      marketTime: "BMO",
      earningsTime: "07:55",
      earningsEstimate: "$0.76",
      revenueEstimate: "$54.60 Mil",
      revenueGrowth: "-26.7%",
    },
    {
      symbol: "NTRS",
      marketTime: "BMO",
      earningsTime: "08:15",
      earningsEstimate: "$1.97",
      revenueEstimate: "$1.93 Bil",
      revenueGrowth: "-40.8%",
    },
    {
      symbol: "UNP",
      marketTime: "BMO",
      earningsTime: "07:45",
      earningsEstimate: "$2.76",
      revenueEstimate: "$6.14 Bil",
      revenueGrowth: "-0.3%",
    },
    {
      symbol: "WTBA",
      marketTime: "BMO",
      earningsTime: "08:30",
      earningsEstimate: "$0.40",
      revenueEstimate: "$21.42 Mil",
      revenueGrowth: "-52.0%",
    },
    // After Market Close (AMC)
    {
      symbol: "CSX",
      marketTime: "AMC",
      earningsTime: "16:00",
      earningsEstimate: "$0.44",
      revenueEstimate: "$3.74 Bil",
      revenueGrowth: "1.6%",
    },
    {
      symbol: "SRCE",
      marketTime: "AMC",
      earningsEstimate: "$1.36",
      revenueEstimate: "$97.50 Mil",
      revenueGrowth: "-27.6%",
    },
    {
      symbol: "ASB",
      marketTime: "AMC",
      earningsTime: "16:15",
      earningsEstimate: "$0.53",
      revenueEstimate: "$341.50 Mil",
      revenueGrowth: "-42.1%",
    },
    {
      symbol: "COLB",
      marketTime: "AMC",
      earningsEstimate: "$0.65",
      revenueEstimate: "$491.60 Mil",
      revenueGrowth: "-35.1%",
    },
    {
      symbol: "EWBC",
      marketTime: "AMC",
      earningsTime: "16:05",
      earningsEstimate: "$2.13",
      revenueEstimate: "$644.33 Mil",
      revenueGrowth: "-39.8%",
    },
  ],
  "2025-01-24": [
    // Before Market Open (BMO)
    {
      symbol: "VZ",
      marketTime: "BMO",
      earningsTime: "07:00",
      earningsEstimate: "$1.11",
      revenueEstimate: "$35.70 Bil",
      revenueGrowth: "1.6%",
    },
    {
      symbol: "AXP",
      marketTime: "BMO",
      earningsTime: "07:00",
      earningsEstimate: "$3.02",
      revenueEstimate: "$17.17 Bil",
      revenueGrowth: "8.7%",
    },
    {
      symbol: "ERIC",
      marketTime: "BMO",
      earningsEstimate: "$0.20",
      revenueEstimate: "$6.96 Bil",
      revenueGrowth: "3.0%",
    },
  ],
  "2025-01-27": [
    // Before Market Open (BMO)
    {
      symbol: "T",
      marketTime: "BMO",
      earningsTime: "06:35",
      earningsEstimate: "$0.48",
      revenueEstimate: "$32.29 Bil",
      revenueGrowth: "0.8%",
    },
    // After Market Close (AMC)
    {
      symbol: "NUE",
      marketTime: "AMC",
      earningsTime: "16:30",
      earningsEstimate: "$0.62",
      revenueEstimate: "$6.84 Bil",
      revenueGrowth: "-11.2%",
    },
    {
      symbol: "ARE",
      marketTime: "AMC",
      earningsTime: "16:10",
      earningsEstimate: "$2.39",
      revenueEstimate: "$783.75 Mil",
      revenueGrowth: "3.5%",
    },
    {
      symbol: "MRTN",
      marketTime: "AMC",
      earningsTime: "16:00",
      earningsEstimate: "$0.06",
      revenueEstimate: "$235.00 Mil",
      revenueGrowth: "-12.4%",
    },
  ],
  "2025-01-28": [
    // Before Market Open (BMO)
    {
      symbol: "GM",
      marketTime: "BMO",
      earningsTime: "06:30",
      earningsEstimate: "$1.74",
      revenueEstimate: "$43.66 Bil",
      revenueGrowth: "1.6%",
    },
    {
      symbol: "BPOP",
      marketTime: "BMO",
      earningsTime: "07:00",
      earningsEstimate: "$2.08",
      revenueEstimate: "$740.72 Mil",
      revenueGrowth: "-28.5%",
    },
    {
      symbol: "LMT",
      marketTime: "BMO",
      earningsTime: "07:30",
      earningsEstimate: "$6.57",
      revenueEstimate: "$18.51 Bil",
      revenueGrowth: "-1.9%",
    },
    {
      symbol: "PCAR",
      marketTime: "BMO",
      earningsTime: "08:00",
      earningsEstimate: "$1.67",
      revenueEstimate: "$7.52 Bil",
      revenueGrowth: "-17.1%",
    },
    // After Market Close (AMC)
    {
      symbol: "SAP",
      marketTime: "AMC",
      earningsTime: "16:05",
      earningsEstimate: "$1.53",
      revenueEstimate: "$9.89 Bil",
      revenueGrowth: "8.5%",
    },
    {
      symbol: "PKG",
      marketTime: "AMC",
      earningsTime: "16:15",
      earningsEstimate: "$2.51",
      revenueEstimate: "$2.09 Bil",
      revenueGrowth: "7.8%",
    },
    {
      symbol: "AX",
      marketTime: "AMC",
      earningsTime: "16:05",
      earningsEstimate: "$1.76",
      revenueEstimate: "$302.37 Mil",
      revenueGrowth: "-41.7%",
    },
  ],
  "2025-01-29": [
    // Before Market Open (BMO)
    {
      symbol: "PGR",
      marketTime: "BMO",
      earningsTime: "08:20",
      earningsEstimate: "$3.43",
      revenueEstimate: "$19.90 Bil",
      revenueGrowth: "17.8%",
    },
    {
      symbol: "ASML",
      marketTime: "BMO",
      earningsEstimate: "$7.18",
      revenueEstimate: "$9.76 Bil",
      revenueGrowth: "25.2%",
    },
    {
      symbol: "ADP",
      marketTime: "BMO",
      earningsTime: "07:00",
      earningsEstimate: "$2.27",
      revenueEstimate: "$4.97 Bil",
      revenueGrowth: "6.5%",
    },
    {
      symbol: "TEVA",
      marketTime: "BMO",
      earningsTime: "07:00",
      earningsEstimate: "$0.66",
      revenueEstimate: "$4.10 Bil",
      revenueGrowth: "-8.0%",
    },
    {
      symbol: "MHO",
      marketTime: "BMO",
      earningsTime: "07:30",
      earningsEstimate: "$4.83",
      revenueEstimate: "$1.14 Bil",
      revenueGrowth: "17.2%",
    },
    {
      symbol: "NSC",
      marketTime: "BMO",
      earningsTime: "08:00",
      earningsEstimate: "$2.97",
      revenueEstimate: "$3.06 Bil",
      revenueGrowth: "-0.4%",
    },
    {
      symbol: "PB",
      marketTime: "BMO",
      earningsTime: "06:30",
      earningsEstimate: "$1.33",
      revenueEstimate: "$302.15 Mil",
      revenueGrowth: "-26.8%",
    },
    {
      symbol: "SMG",
      marketTime: "BMO",
      earningsTime: "07:00",
      earningsEstimate: "-$1.28",
      revenueEstimate: "$410.37 Mil",
      revenueGrowth: "-0.0%",
    },
    {
      symbol: "TMUS",
      marketTime: "BMO",
      earningsEstimate: "$2.17",
      revenueEstimate: "$21.24 Bil",
      revenueGrowth: "3.7%",
    },
    // After Market Close (AMC)
    {
      symbol: "TSLA",
      marketTime: "AMC",
      earningsTime: "16:05",
      earningsEstimate: "$0.65",
      revenueEstimate: "$27.95 Bil",
      revenueGrowth: "11.1%",
    },
    {
      symbol: "IBM",
      marketTime: "AMC",
      earningsTime: "16:10",
      earningsEstimate: "$3.74",
      revenueEstimate: "$17.60 Bil",
      revenueGrowth: "1.3%",
    },
    {
      symbol: "CCS",
      marketTime: "AMC",
      earningsTime: "16:05",
      earningsEstimate: "$3.21",
      revenueEstimate: "$1.30 Bil",
      revenueGrowth: "7.8%",
    },
    {
      symbol: "WHR",
      marketTime: "AMC",
      earningsTime: "16:05",
      earningsEstimate: "$4.35",
      revenueEstimate: "$4.25 Bil",
      revenueGrowth: "-16.5%",
    },
    {
      symbol: "CALX",
      marketTime: "AMC",
      earningsTime: "16:10",
      earningsEstimate: "-$0.12",
      revenueEstimate: "$203.86 Mil",
      revenueGrowth: "-23.0%",
    },
    {
      symbol: "LSTR",
      marketTime: "AMC",
      earningsTime: "16:05",
      earningsEstimate: "$1.36",
      revenueEstimate: "$1.21 Bil",
      revenueGrowth: "0.5%",
    },
    {
      symbol: "MTH",
      marketTime: "AMC",
      earningsTime: "16:30",
      earningsEstimate: "$4.54",
      revenueEstimate: "$1.56 Bil",
      revenueGrowth: "-6.0%",
    },
    {
      symbol: "RJF",
      marketTime: "AMC",
      earningsTime: "16:15",
      earningsEstimate: "$2.73",
      revenueEstimate: "$3.46 Bil",
      revenueGrowth: "-1.7%",
    },
    {
      symbol: "WM",
      marketTime: "AMC",
      earningsTime: "17:20",
      earningsEstimate: "$1.79",
      revenueEstimate: "$5.51 Bil",
      revenueGrowth: "5.6%",
    },
  ],
  "2025-01-30": [
    // Before Market Open (BMO)
    {
      symbol: "DOW",
      marketTime: "BMO",
      earningsTime: "06:00",
      earningsEstimate: "$0.33",
      revenueEstimate: "$10.66 Bil",
      revenueGrowth: "0.4%",
    },
    {
      symbol: "LUV",
      marketTime: "BMO",
      earningsTime: "06:45",
      earningsEstimate: "$0.40",
      revenueEstimate: "$6.86 Bil",
      revenueGrowth: "0.6%",
    },
    {
      symbol: "CAH",
      marketTime: "BMO",
      earningsTime: "06:45",
      earningsEstimate: "$1.74",
      revenueEstimate: "$54.47 Bil",
      revenueGrowth: "-5.2%",
    },
    {
      symbol: "CMCSA",
      marketTime: "BMO",
      earningsTime: "07:00",
      earningsEstimate: "$0.88",
    },
    {
      symbol: "PHM",
      marketTime: "BMO",
      earningsTime: "06:30",
      earningsEstimate: "$3.20",
      revenueEstimate: "$4.64 Bil",
      revenueGrowth: "8.1%",
    },
    {
      symbol: "SHW",
      marketTime: "BMO",
      earningsTime: "07:00",
      earningsEstimate: "$2.08",
      revenueEstimate: "$5.37 Bil",
      revenueGrowth: "2.2%",
    },
    {
      symbol: "SNY",
      marketTime: "BMO",
      earningsEstimate: "$0.76",
      revenueEstimate: "$13.34 Bil",
      revenueGrowth: "13.5%",
    },
    {
      symbol: "TMO",
      marketTime: "BMO",
      earningsTime: "06:00",
      earningsEstimate: "$5.92",
      revenueEstimate: "$11.25 Bil",
      revenueGrowth: "3.3%",
    },
    {
      symbol: "VLO",
      marketTime: "BMO",
      earningsTime: "06:30",
      earningsEstimate: "$0.56",
      revenueEstimate: "$32.23 Bil",
      revenueGrowth: "-9.0%",
    },
    {
      symbol: "CHKP",
      marketTime: "BMO",
      earningsTime: "06:00",
      earningsEstimate: "$2.31",
      revenueEstimate: "$699.46 Mil",
      revenueGrowth: "5.4%",
    },
    {
      symbol: "KEX",
      marketTime: "BMO",
      earningsTime: "07:00",
      earningsEstimate: "$1.27",
      revenueEstimate: "$821.14 Mil",
      revenueGrowth: "2.7%",
    },
    {
      symbol: "MO",
      marketTime: "BMO",
      earningsTime: "07:00",
      earningsEstimate: "$1.28",
      revenueEstimate: "$5.04 Bil",
      revenueGrowth: "-15.6%",
    },
    {
      symbol: "MUR",
      marketTime: "BMO",
      earningsTime: "06:00",
      earningsEstimate: "$0.71",
      revenueEstimate: "$777.86 Mil",
      revenueGrowth: "-7.9%",
    },
    {
      symbol: "NOC",
      marketTime: "BMO",
      earningsTime: "06:55",
      earningsEstimate: "$6.24",
      revenueEstimate: "$10.96 Bil",
      revenueGrowth: "3.0%",
    },
    {
      symbol: "SILC",
      marketTime: "BMO",
      earningsTime: "08:15",
    },
    // After Market Close (AMC)
    {
      symbol: "WY",
      marketTime: "AMC",
      earningsTime: "16:25",
      earningsEstimate: "$0.05",
      revenueEstimate: "$1.72 Bil",
      revenueGrowth: "-3.0%",
    },
    {
      symbol: "BAFN",
      marketTime: "AMC",
      earningsTime: "18:00",
    },
  ],
  "2025-01-31": [
    // Before Market Open (BMO)
    {
      symbol: "CL",
      marketTime: "BMO",
      earningsTime: "06:55",
      earningsEstimate: "$0.90",
      revenueEstimate: "$5.06 Bil",
      revenueGrowth: "2.2%",
    },
    {
      symbol: "BAH",
      marketTime: "BMO",
      earningsTime: "06:45",
      earningsEstimate: "$1.48",
      revenueEstimate: "$2.85 Bil",
      revenueGrowth: "10.9%",
    },
    {
      symbol: "PSX",
      marketTime: "BMO",
      earningsTime: "07:00",
      earningsEstimate: "$0.82",
      revenueEstimate: "$30.35 Bil",
    },
    {
      symbol: "GWW",
      marketTime: "BMO",
      earningsTime: "08:00",
      earningsEstimate: "$9.77",
      revenueEstimate: "$4.25 Bil",
      revenueGrowth: "6.3%",
    },
  ],
};

// Helper functions
export const getSymbolsForDate = (date: string): string[] => {
  return (EARNINGS_CALENDAR[date] || []).map((entry) => entry.symbol);
};

export const isSymbolScheduledForDate = (
  symbol: string,
  date: string
): boolean => {
  const entries = EARNINGS_CALENDAR[date] || [];
  return entries.some((entry) => entry.symbol === symbol);
};
