import type { Metadata } from "next";
import localFont from "next/font/local";
// import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ModalProvider } from "@/providers/modal-provider";
import GoogleAnalytics from "./googleAnalytics";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "./providers";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { SearchCommand } from "@/components/search-command";
import { GoogleTagManager } from "@next/third-parties/google";

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
    images: [
      {
        url: "https://www.earningswave.com/images/ew-logo.png",
        width: 1366,
        height: 768,
        alt: "EarningsWave Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EarningsWave - Competitive Edge in Earnings Analysis",
    description:
      "Get a competitive edge in earnings analysis with EarningsWave. Real-time insights, advanced analytics, and comprehensive reports for investors and analysts.",
    images: ["https://www.earningswave.com/images/ew-logo.png"],
    creator: "@EarningsWaves",
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
    <ClerkProvider>
      <html lang="en" className="bg-white dark:bg-slate-900">
        <head>
          <GoogleAnalytics GA_MEASUREMENT_ID="G-ZD51TYHM3M" />
          <script async src="//cdn.trackdesk.com/tracking.js" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(t,d,k){(t[k]=t[k]||[]).push(d);t[d]=t[d]||t[k].f||function(){(t[d].q=t[d].q||[]).push(arguments)}})(window,"trackdesk","TrackdeskObject");
                trackdesk('earningswave', 'click');
              `,
            }}
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-200`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
          >
            <Providers>
              <ModalProvider />
              <SearchCommand />

              {children}
            </Providers>
            <Toaster
              position="bottom-left"
              theme="system"
              toastOptions={{
                className:
                  "bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-slate-800/50",
              }}
            />
          </ThemeProvider>
          <Analytics />
          <GoogleTagManager gtmId="GTM-525F6NV9" />

          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function () {
                    var cookie = document.cookie.match('(^|;)\\s*trakdesk_cid\\s*=\\s*([^;]+)');
                    if (Array.isArray(cookie)) {
                        try {
                            var trakdeskCid = JSON.parse(cookie.pop());
                            var cid = trakdeskCid['cid'];
                            document.querySelectorAll('a[href^="https://buy.stripe.com/"]').forEach(function (a) {
                                var url = new URL(a.href);
                                url.searchParams.set('client_reference_id', cid);
                                a.href = url.href;
                            });
                        } catch (e) {
                            console.log(e);
                        }
                    }
                })();
              `,
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
