import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { edgeMediaServerFormFill } from "@/lib/utils";

export async function GET(request: Request) {
  let browser;
  try {
    // Get ticker from URL params
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get("ticker");

    if (!ticker) {
      return NextResponse.json(
        { success: false, error: "Ticker parameter is required" },
        { status: 400 }
      );
    }

    browser = await puppeteer.launch({});

    const page = await browser.newPage();
    await page.goto("https://www.marketbeat.com/earnings/conference-calls/");

    // Modified selector to find the specific ticker's earnings call link
    const earningsCallLink = await page.evaluate((tickerParam) => {
      const rows = Array.from(document.querySelectorAll("tr"));
      const targetRow = rows.find((row) => {
        const tickerCell = row.querySelector("td[data-clean]");
        return tickerCell?.getAttribute("data-clean")?.startsWith(tickerParam);
      });

      if (!targetRow) return null;

      const callLink = targetRow.querySelector(
        'a[href*="wallstreethorizon"]'
      ) as HTMLAnchorElement;
      return callLink ? callLink.href : null;
    }, ticker.toUpperCase());

    if (!earningsCallLink) {
      return NextResponse.json(
        {
          success: false,
          error: "No earnings call found for the specified ticker",
        },
        { status: 404 }
      );
    }

    const audioFile = await edgeMediaServerFormFill(earningsCallLink);

    return NextResponse.json({
      success: true,
      link: earningsCallLink,
      audioFile,
    });
  } catch (error) {
    console.error("Error scraping earnings calls:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to scrape earnings call links",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
