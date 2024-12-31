interface CalendarEntry {
  symbol: string;
  time?: "BMO" | "AMC"; // Before Market Open or After Market Close
  confirmed?: boolean; // Optional: if the date is confirmed
}

type EarningsCalendar = {
  [date: string]: CalendarEntry[];
};

export const EARNINGS_CALENDAR: EarningsCalendar = {
  "2024-12-16": [
    // Before Market Open (BMO)
    { symbol: "ZDGE", time: "BMO" },
    { symbol: "ESOA", time: "BMO" },
    { symbol: "CNTM", time: "BMO" },
    { symbol: "BRN", time: "BMO" },
    // After Market Close (AMC)
    { symbol: "OPTT", time: "AMC" },
    { symbol: "BCTX", time: "AMC" },
    { symbol: "ARKR", time: "AMC" },
    { symbol: "AMTM", time: "AMC" },
    { symbol: "RICK", time: "AMC" },
    { symbol: "QIPT", time: "AMC" },
    { symbol: "MITK", time: "AMC" },
    { symbol: "NCPL", time: "AMC" },
    { symbol: "STRM", time: "AMC" },
    { symbol: "RCAT", time: "AMC" },
    { symbol: "MAMA", time: "AMC" },
    { symbol: "CMP", time: "AMC" },
    { symbol: "USAU", time: "AMC" },
    { symbol: "ENZ", time: "AMC" },
    { symbol: "MSS", time: "AMC" },
    { symbol: "HSCS", time: "AMC" },
    { symbol: "LTRY", time: "AMC" },
  ],
  "2024-12-17": [
    // Before Market Open (BMO)
    { symbol: "ZJK", time: "BMO" },
    { symbol: "REE", time: "BMO" },
    { symbol: "CMCM", time: "BMO" },
    { symbol: "PFX", time: "BMO" },
    { symbol: "EPIX", time: "BMO" },
    { symbol: "NMTC", time: "BMO" },
    { symbol: "PETZ", time: "BMO" },
    { symbol: "SONN", time: "BMO" },
    // After Market Close (AMC)
    { symbol: "HEI", time: "AMC" },
    { symbol: "HEI.A", time: "AMC" },
    { symbol: "WOR", time: "AMC" },
    { symbol: "ELP", time: "AMC" },
    { symbol: "APDN", time: "AMC" },
  ],
  "2024-12-18": [
    // Before Market Open (BMO)
    { symbol: "GIS", time: "BMO", confirmed: true }, // Confirmed 7:00 AM ET
    { symbol: "JBL", time: "BMO", confirmed: true }, // Confirmed 7:45 AM ET
    { symbol: "BIRK", time: "BMO", confirmed: true }, // Confirmed 5:20 AM ET
    { symbol: "TTC", time: "BMO", confirmed: true }, // Confirmed 8:30 AM ET
    { symbol: "ABM", time: "BMO", confirmed: true }, // Confirmed 6:58 AM ET
    { symbol: "LDTC", time: "BMO", confirmed: true }, // Confirmed 7:30 AM ET
    { symbol: "TKLF", time: "BMO", confirmed: true }, // Confirmed 6:00 AM ET
    { symbol: "OGI", time: "BMO", confirmed: true }, // Confirmed 6:00 AM ET
    // After Market Close (AMC)
    { symbol: "MU", time: "AMC", confirmed: true }, // Confirmed 4:02 PM ET
    { symbol: "LEN", time: "AMC", confirmed: true }, // Confirmed 4:30 PM ET
    { symbol: "LEN.B", time: "AMC", confirmed: true }, // Confirmed 4:30 PM ET
    { symbol: "SCS", time: "AMC", confirmed: true }, // Confirmed 4:05 PM ET
    { symbol: "WS", time: "AMC", confirmed: true }, // Confirmed 4:10 PM ET
    { symbol: "EPAC", time: "AMC", confirmed: true }, // Confirmed 4:30 PM ET
    { symbol: "MLKN", time: "AMC", confirmed: true }, // Confirmed 4:05 PM ET
    { symbol: "NRSN", time: "AMC", confirmed: true }, // Added
    { symbol: "YCBD", time: "AMC", confirmed: true }, // Added
    { symbol: "BACK", time: "AMC", confirmed: true }, // Added
  ],
  "2024-12-19": [
    // Before Market Open (BMO)
    { symbol: "ACN", time: "BMO", confirmed: true }, // Confirmed 6:39 AM ET
    { symbol: "CTAS", time: "BMO", confirmed: true }, // Confirmed 8:30 AM ET
    { symbol: "PAYX", time: "BMO", confirmed: true }, // Confirmed 8:30 AM ET
    { symbol: "DRI", time: "BMO", confirmed: true }, // Confirmed 7:00 AM ET
    { symbol: "FDS", time: "BMO", confirmed: true }, // Confirmed 7:00 AM ET
    { symbol: "FCEL", time: "BMO", confirmed: true }, // Confirmed 7:30 AM ET
    { symbol: "KMX", time: "BMO", confirmed: true }, // Confirmed 6:50 AM ET
    { symbol: "CAG", time: "BMO", confirmed: true }, // Confirmed 7:30 AM ET
    { symbol: "LW", time: "BMO", confirmed: true }, // Confirmed 6:00 AM ET
    { symbol: "SHCO", time: "BMO", confirmed: true }, // Added - Confirmed 8:01 AM ET
    // After Market Close (AMC)
    { symbol: "NKE", time: "AMC", confirmed: true }, // Confirmed 4:15 PM ET
    { symbol: "FDX", time: "AMC", confirmed: true }, // Confirmed 4:04 PM ET
    { symbol: "BB", time: "AMC", confirmed: true }, // Confirmed 5:05 PM ET
    { symbol: "AVO", time: "AMC", confirmed: true }, // Confirmed 4:05 PM ET
    { symbol: "SCHL", time: "AMC", confirmed: true }, // Confirmed 4:01 PM ET
    { symbol: "ISSC", time: "AMC", confirmed: true }, // Confirmed 4:05 PM ET
    { symbol: "MOBX", time: "AMC", confirmed: true }, // Confirmed 4:00 PM ET
  ],
  "2024-12-20": [
    // Before Market Open (BMO)
    { symbol: "CCL", time: "BMO", confirmed: true }, // Confirmed 9:15 AM ET
    { symbol: "WGO", time: "BMO", confirmed: true }, // Confirmed 7:00 AM ET
    { symbol: "CUK", time: "BMO", confirmed: true }, // Confirmed 9:15 AM ET
    { symbol: "SATX", time: "BMO", confirmed: true }, // Confirmed 8:00 AM ET
    { symbol: "CSPI", time: "BMO", confirmed: true }, // Added - Confirmed 8:30 AM ET
  ],
  "2024-12-23": [
    // Before Market Open (BMO)
    { symbol: "AVXL", time: "BMO", confirmed: true }, // Confirmed 7:30 AM ET
    { symbol: "EBF", time: "BMO", confirmed: true }, // Confirmed 6:00 AM ET
    { symbol: "OCC", time: "BMO", confirmed: true }, // Confirmed 8:15 AM ET
    // After Market Close (AMC)
    { symbol: "LMNR", time: "AMC", confirmed: true }, // Confirmed 4:05 PM ET
    { symbol: "BLIN", time: "AMC", confirmed: true }, // Confirmed 4:07 PM ET
  ],
  "2024-12-24": [
    // Before Market Open (BMO)
    { symbol: "NONE", time: "BMO" },
  ],
  "2024-12-26": [
    // Before Market Open (BMO)
    { symbol: "NONE", time: "BMO" },
  ],
  "2024-12-27": [
    { symbol: "AMTM", time: "BMO" },
    // { symbol: "PCYG", time: "AMC" },
  ],
  "2024-12-30": [
    // Before Market Open (BMO)
    { symbol: "NNE", time: "BMO", confirmed: true }, // Confirmed 8:00 AM ET
    { symbol: "PMEC", time: "BMO", confirmed: true }, // Confirmed 6:54 AM ET
    { symbol: "KUKE", time: "BMO", confirmed: true }, // Confirmed 8:00 AM ET
    // After Market Close (AMC)
    { symbol: "ELLO", time: "AMC", confirmed: true }, // Confirmed 4:15 PM ET
    { symbol: "DGLY", time: "AMC", confirmed: true }, // Confirmed 12:30 PM ET
  ],
  "2024-12-31": [
    // Before Market Open (BMO)
    { symbol: "BTI", time: "BMO", confirmed: true }, // Confirmed 8:44 AM ET
    { symbol: "ZJK", time: "BMO", confirmed: true }, // Confirmed 4:35 AM ET
    { symbol: "FUND", time: "BMO", confirmed: true }, // Confirmed 7:00 AM ET
    { symbol: "HOLO", time: "BMO", confirmed: true }, // Confirmed 7:00 AM ET
    { symbol: "SVMH", time: "BMO", confirmed: true }, // Confirmed 9:01 AM ET
    { symbol: "DSY", time: "BMO", confirmed: true }, // Confirmed 6:14 AM ET
    { symbol: "EUDA", time: "BMO", confirmed: true }, // Confirmed 5:31 AM ET
    { symbol: "INCR", time: "BMO", confirmed: true }, // Confirmed 8:00 AM ET
    { symbol: "PMEC", time: "BMO", confirmed: true }, // Confirmed 6:54 AM ET
    { symbol: "JDZG", time: "BMO", confirmed: true }, // Confirmed 8:22 AM ET
    { symbol: "KUKE", time: "BMO", confirmed: true }, // Confirmed 8:00 AM ET
    { symbol: "ABTS", time: "BMO", confirmed: true }, // Confirmed 2:21 AM ET
    { symbol: "UBXG", time: "BMO", confirmed: true }, // Confirmed 5:04 AM ET
    { symbol: "JL", time: "BMO", confirmed: true }, // Confirmed 4:46 AM ET
    { symbol: "AMBO", time: "BMO", confirmed: true }, // Confirmed 5:42 AM ET
    { symbol: "LICN", time: "BMO", confirmed: true }, // Confirmed 1:27 AM ET
    { symbol: "ELWS", time: "BMO", confirmed: true }, // Confirmed 3:19 AM ET
    { symbol: "WLDS", time: "BMO", confirmed: true }, // Confirmed 1:32 AM ET
    { symbol: "ICON", time: "BMO", confirmed: true }, // Confirmed 5:16 AM ET
    { symbol: "FRES", time: "BMO", confirmed: true }, // Confirmed 3:00 AM ET
    // After Market Close (AMC)
    { symbol: "ATGL", time: "AMC", confirmed: true }, // Confirmed 5:30 PM ET
    { symbol: "ATHE", time: "AMC", confirmed: true }, // Confirmed 4:13 PM ET
    { symbol: "SPPL", time: "AMC", confirmed: true }, // Confirmed 10:06 AM ET
    { symbol: "ABVE", time: "AMC", confirmed: true }, // Confirmed 11:01 PM ET
    { symbol: "NTRP", time: "AMC", confirmed: true }, // Confirmed 4:00 PM ET
    { symbol: "SMX", time: "AMC", confirmed: true }, // Confirmed 5:09 PM ET
  ],
  "2025-01-02": [
    { symbol: "RGP", time: "AMC", confirmed: true }, // Confirmed 4:05 PM ET
    { symbol: "LFCR", time: "AMC", confirmed: true }, // Confirmed 4:05 PM ET
  ],
  "2025-01-03": [
    // Before Market Open (BMO)
    { symbol: "WRD", time: "BMO", confirmed: true }, // Confirmed 3:30 AM ET
    { symbol: "HTCO", time: "BMO", confirmed: true }, // Confirmed 4:52 AM ET
    { symbol: "IMMR", time: "BMO", confirmed: true }, // Confirmed 9:00 AM ET
    { symbol: "PCSC", time: "BMO", confirmed: true }, // Confirmed 2:36 AM ET
    { symbol: "ESGL", time: "BMO", confirmed: true }, // Confirmed 3:48 AM ET
    { symbol: "MTC", time: "BMO", confirmed: true }, // Confirmed 3:06 AM ET
    { symbol: "FEDU", time: "BMO", confirmed: true }, // Confirmed 6:00 AM ET
    { symbol: "NCI", time: "BMO", confirmed: true }, // Confirmed 8:26 AM ET
    { symbol: "GSIW", time: "BMO", confirmed: true }, // Confirmed 4:59 AM ET
    { symbol: "CANF", time: "BMO", confirmed: true }, // Confirmed 7:00 AM ET
    { symbol: "BLMZ", time: "BMO", confirmed: true }, // Confirmed 6:15 AM ET
    { symbol: "CMND", time: "BMO", confirmed: true }, // Confirmed 5:46 AM ET
    { symbol: "BQ", time: "BMO", confirmed: true }, // Confirmed 5:00 AM ET
    { symbol: "FAMI", time: "BMO", confirmed: true }, // Confirmed 8:00 AM ET
    // After Market Close (AMC)
    { symbol: "RDIB", time: "AMC", confirmed: true }, // Confirmed 5:00 PM ET
    { symbol: "CHSN", time: "AMC", confirmed: true }, // Confirmed 4:48 PM ET
    { symbol: "NRT", time: "AMC", confirmed: true }, // Confirmed 4:00 PM ET
    { symbol: "PWM", time: "AMC", confirmed: true }, // Confirmed 5:01 PM ET
    { symbol: "BREA", time: "AMC", confirmed: true }, // Confirmed 5:15 PM ET
    { symbol: "EJH", time: "AMC", confirmed: true }, // Confirmed 4:00 PM ET
    { symbol: "GRAF.U", time: "AMC", confirmed: true }, // Confirmed 10:24 PM ET
  ],
  "2025-01-06": [
    // Before Market Open (BMO)
    { symbol: "CMC", time: "BMO", confirmed: true }, // Confirmed 6:30 AM ET
  ],
  "2025-01-07": [
    // Before Market Open (BMO)
    { symbol: "RPM", time: "BMO", confirmed: true }, // Confirmed 6:45 AM ET
    { symbol: "APOG", time: "BMO", confirmed: true }, // Confirmed 6:15 AM ET
    { symbol: "LNN", time: "BMO", confirmed: true }, // Confirmed 6:45 AM ET
    { symbol: "NVNI", time: "BMO", confirmed: true }, // Confirmed 6:51 AM ET
    { symbol: "TOP", time: "BMO", confirmed: true }, // Confirmed 7:00 AM ET
    // After Market Close (AMC)
    { symbol: "GGAL", time: "AMC", confirmed: true }, // Confirmed 4:00 PM ET
    { symbol: "AIR", time: "AMC", confirmed: true }, // Confirmed 4:05 PM ET
    { symbol: "KRUS", time: "AMC", confirmed: true }, // Confirmed 4:05 PM ET
    { symbol: "SLP", time: "AMC", confirmed: true }, // Confirmed 4:06 PM ET
    { symbol: "SOGP", time: "AMC", confirmed: true }, // Confirmed 4:00 PM ET
    { symbol: "JXJT", time: "AMC", confirmed: true }, // Confirmed 1:00 PM ET
  ],
  "2025-01-08": [
    // Before Market Open (BMO)
    { symbol: "MSM", time: "BMO", confirmed: true }, // Confirmed 6:30 AM ET
    { symbol: "UNF", time: "BMO", confirmed: true }, // Confirmed 8:00 AM ET
    { symbol: "ANGO", time: "BMO", confirmed: true }, // Confirmed 6:30 AM ET
    { symbol: "ACI", time: "BMO", confirmed: true }, // Confirmed 8:30 AM ET
    { symbol: "SMPL", time: "BMO", confirmed: true }, // Confirmed 7:00 AM ET
    { symbol: "RDUS", time: "BMO", confirmed: true }, // Confirmed 8:00 AM ET
    // After Market Close (AMC)
    { symbol: "JEF", time: "AMC", confirmed: true }, // Confirmed 4:15 PM ET
    { symbol: "SAR", time: "AMC", confirmed: true }, // Confirmed 4:05 PM ET
    { symbol: "AZZ", time: "AMC", confirmed: true }, // Confirmed 4:15 PM ET
    { symbol: "PENG", time: "AMC", confirmed: true }, // Confirmed 4:10 PM ET
    { symbol: "GBX", time: "AMC", confirmed: true }, // Confirmed 4:15 PM ET
    { symbol: "FC", time: "AMC", confirmed: true }, // Confirmed 4:05 PM ET
    { symbol: "PCYO", time: "AMC", confirmed: true }, // Confirmed 4:00 PM ET
  ],
  "2025-01-09": [
    // Before Market Open (BMO)
    { symbol: "WBA", time: "BMO", confirmed: true }, // Confirmed 7:00 AM ET
    { symbol: "TLRY", time: "BMO", confirmed: true }, // Confirmed 7:00 AM ET
    { symbol: "STZ", time: "BMO", confirmed: true }, // Confirmed 7:30 AM ET
    { symbol: "AYI", time: "BMO", confirmed: true }, // Confirmed 6:00 AM ET
    { symbol: "HELE", time: "BMO", confirmed: true }, // Confirmed 6:45 AM ET
    { symbol: "NEOG", time: "BMO", confirmed: true }, // Confirmed 7:00 AM ET
    // After Market Close (AMC)
    { symbol: "AEHR", time: "AMC", confirmed: true }, // Confirmed 4:05 PM ET
    { symbol: "KBH", time: "AMC", confirmed: true }, // Confirmed 4:10 PM ET
    { symbol: "WDFC", time: "AMC", confirmed: true }, // Confirmed 4:05 PM ET
    { symbol: "ACCD", time: "AMC", confirmed: true }, // Confirmed 4:05 PM ET
    { symbol: "PSMT", time: "AMC", confirmed: true }, // Confirmed 4:01 PM ET
    { symbol: "ETWO", time: "AMC", confirmed: true }, // Confirmed 4:15 PM ET
    { symbol: "BBCP", time: "AMC", confirmed: true }, // Confirmed 4:05 PM ET
  ],
  "2025-01-10": [
    // Before Market Open (BMO)
    { symbol: "DAL", time: "BMO", confirmed: true }, // Confirmed 6:30 AM ET
    { symbol: "SNX", time: "BMO", confirmed: true }, // Confirmed 8:05 AM ET
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
