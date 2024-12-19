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
    { symbol: "AVXL", time: "BMO" },
    // After Market Close (AMC)
    { symbol: "LMNR", time: "AMC" },
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
    // Before Market Open (BMO)
    { symbol: "AMTM", time: "BMO" },
  ],
  "2024-12-30": [
    // Before Market Open (BMO)
    { symbol: "IH", time: "BMO" },
    { symbol: "SWVL", time: "BMO" },
    { symbol: "PMEC", time: "BMO" },
    { symbol: "KUKE", time: "BMO" },
    // After Market Close (AMC)
    { symbol: "GGAL", time: "AMC" },
    { symbol: "DJCO", time: "AMC" },
    { symbol: "AMTD", time: "AMC" },
    { symbol: "RETO", time: "AMC" },
    { symbol: "PT", time: "AMC" },
    { symbol: "BLIN", time: "AMC" },
    { symbol: "ANTE", time: "AMC" },
    { symbol: "LKCO", time: "AMC" },
  ],
  "2024-01-02": [
    // Before Market Open (BMO)
    { symbol: "LNN", time: "BMO" },
    { symbol: "RDUS", time: "BMO" },
    // After Market Close (AMC)
    { symbol: "CALM", time: "AMC" },
    { symbol: "KRUS", time: "AMC" },
    { symbol: "SLP", time: "AMC" },
    { symbol: "FC", time: "AMC" },
    { symbol: "RGP", time: "AMC" },
    { symbol: "BDL", time: "AMC" },
  ],
  "2024-01-03": [
    // Before Market Open (BMO)
    { symbol: "ANGO", time: "BMO" },
    { symbol: "GBX", time: "BMO" },
    { symbol: "HURC", time: "BMO" },
  ],
  "2024-01-06": [
    // Before Market Open (BMO)
    { symbol: "CMC", time: "BMO" },
    { symbol: "HELE", time: "BMO" },
    // After Market Close (AMC)
    { symbol: "JEF", time: "AMC" },
    { symbol: "GLYC", time: "AMC" },
    { symbol: "EEIQ", time: "AMC" },
  ],
  "2024-01-07": [
    // Before Market Open (BMO)
    { symbol: "RPM", time: "BMO" },
    { symbol: "ACI", time: "BMO" },
    { symbol: "NEOG", time: "BMO" },
    { symbol: "TLRY", time: "BMO" },
    { symbol: "APOG", time: "BMO" },
    // After Market Close (AMC)
    { symbol: "AZZ", time: "AMC" },
    { symbol: "AIR", time: "AMC" },
    { symbol: "AEHR", time: "AMC" },
    { symbol: "SAR", time: "AMC" },
    { symbol: "PKE", time: "AMC" },
    { symbol: "ETWO", time: "AMC" },
    { symbol: "VOXX", time: "AMC" },
  ],
  "2024-01-08": [
    // Before Market Open (BMO)
    { symbol: "MSM", time: "BMO" },
    { symbol: "UNF", time: "BMO" },
    { symbol: "TAYD", time: "BMO" },
    { symbol: "STAF", time: "BMO" },
    // After Market Close (AMC)
    { symbol: "KBH", time: "AMC" },
    { symbol: "PENG", time: "AMC" },
    { symbol: "RELL", time: "AMC" },
    { symbol: "RMCF", time: "AMC" },
  ],
  "2024-01-09": [
    // Before Market Open (BMO)
    { symbol: "WBA", time: "BMO" },
    { symbol: "STZ", time: "BMO" },
    { symbol: "INFY", time: "BMO" },
    { symbol: "AYI", time: "BMO" },
    { symbol: "SNX", time: "BMO" },
    { symbol: "NTIC", time: "BMO" },
    { symbol: "SMPL", time: "BMO" },
    { symbol: "AXIL", time: "BMO" },
    // After Market Close (AMC)
    { symbol: "WDFC", time: "AMC" },
    { symbol: "PSMT", time: "AMC" },
    { symbol: "BBCP", time: "AMC" },
    { symbol: "ACCD", time: "AMC" },
    { symbol: "PAVS", time: "AMC" },
  ],
  "2024-01-10": [
    // Before Market Open (BMO)
    { symbol: "UNH", time: "BMO" },
    { symbol: "BLK", time: "BMO" },
    { symbol: "DAL", time: "BMO" },
    { symbol: "WIT", time: "BMO" },
    { symbol: "UNTY", time: "BMO" },
    { symbol: "LEDS", time: "BMO" },
    // After Market Close (AMC)
    { symbol: "PCYO", time: "AMC" },
    { symbol: "PLG", time: "AMC" },
    { symbol: "LEXX", time: "AMC" },
  ],
  // Add more dates as needed
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
