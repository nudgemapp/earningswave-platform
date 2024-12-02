interface MarketHoliday {
  date: string; // MM-DD-YYYY format
  name: string;
  closingTime?: string; // 24h format, only for early close days
  closed: boolean; // true for full day closures, false for early closures
}

export const MARKET_HOLIDAYS: MarketHoliday[] = [
  // 2024 Market Holidays
  { date: "01-01-2024", name: "New Year's Day", closed: true },
  { date: "01-15-2024", name: "Martin Luther King Jr. Day", closed: true },
  { date: "02-19-2024", name: "Presidents Day", closed: true },
  { date: "03-28-2024", name: "Good Friday", closed: true },
  { date: "05-27-2024", name: "Memorial Day", closed: true },
  { date: "06-19-2024", name: "Juneteenth", closed: true },
  { date: "07-04-2024", name: "Independence Day", closed: true },
  { date: "09-02-2024", name: "Labor Day", closed: true },
  { date: "11-28-2024", name: "Thanksgiving Day", closed: true },
  { date: "12-25-2024", name: "Christmas Day", closed: true },

  // 2024 Early Closures (1:00 PM ET)
  { date: "11-29-2024", name: "Day After Thanksgiving", closed: false, closingTime: "13:00" },
  { date: "12-24-2024", name: "Christmas Eve", closed: false, closingTime: "13:00" },

  // 2025 Market Holidays
  { date: "01-01-2025", name: "New Year's Day", closed: true },
  { date: "01-20-2025", name: "Martin Luther King Jr. Day", closed: true },
  { date: "02-17-2025", name: "Presidents Day", closed: true },
  { date: "04-18-2025", name: "Good Friday", closed: true },
  { date: "05-26-2025", name: "Memorial Day", closed: true },
  { date: "06-19-2025", name: "Juneteenth", closed: true },
  { date: "07-04-2025", name: "Independence Day", closed: true },
  { date: "09-01-2025", name: "Labor Day", closed: true },
  { date: "11-27-2025", name: "Thanksgiving Day", closed: true },
  { date: "12-25-2025", name: "Christmas Day", closed: true },

  // 2025 Early Closures (1:00 PM ET)
  { date: "11-28-2025", name: "Day After Thanksgiving", closed: false, closingTime: "13:00" },
  { date: "12-24-2025", name: "Christmas Eve", closed: false, closingTime: "13:00" }
];
