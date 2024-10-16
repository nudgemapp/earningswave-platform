import type { Metadata } from "next";
import localFont from "next/font/local";
// import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ModalProvider } from "@/providers/modal-provider";
import { UserProvider } from '@auth0/nextjs-auth0/client';


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "EarningsWave - Competitive Edge in Earnings Analysis",
  description:
    "Get a competitive edge in earnings analysis with EarningsWave. Real-time insights, advanced analytics, and comprehensive reports for investors and analysts.",
  keywords:
    "earnings analysis, financial insights, stock market, investor tools",
  authors: [{ name: "EarningsWave Team" }],
  creator: "EarningsWave",
  publisher: "EarningsWave Inc.",
  alternates: {
    canonical: "https://www.earningswave.com",
  },
  category: "Finance",
  openGraph: {
    title: "EarningsWave - Competitive Edge in Earnings Analysis",
    description:
      "Get a competitive edge in earnings analysis with EarningsWave. Real-time insights, advanced analytics, and comprehensive reports for investors and analysts.",
    type: "website",
    url: "https://www.earningswave.com",
    siteName: "EarningsWave",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // verification: {
  //   google: "your-google-site-verification-code",
  // },
};

// const dmSans = DM_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <UserProvider >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ModalProvider />
        {children}
      </body>
      </UserProvider>
    </html>
  );
}
