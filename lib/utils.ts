import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import puppeteer from "puppeteer";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number, isRevenue = false) => {
  if (isRevenue) {
    // Format revenue in millions/billions
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  }

  // Format EPS
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const edgeMediaServerFormFill = async (link: string) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      channel: "chrome",
      headless: true,
    });

    const page = await browser.newPage();

    // Set up the promise before any navigation
    const m3u8Promise = new Promise((resolve) => {
      page.on("request", (request) => {
        const url = request.url();
        if (
          request.method() === "GET" &&
          url.includes("media-server.com") &&
          url.includes(".m3u8")
        ) {
          console.log("\n=== HLS Stream URL Found ===");
          console.log("URL:", url);
          resolve(url);
        }
      });
    });

    await page.goto(link);

    // Wait for form elements to load
    await page.waitForSelector('input[type="text"]');

    // Form data
    const formData = {
      firstName: "Andy",
      lastName: "Lanchipa",
      email: "andy@nudgem.com",
      institution: "Nudgem",
      country: "United States",
    };

    // Fill in form fields if they exist
    const fillIfExists = async (selector: string, value: string) => {
      const element = await page.$(selector);
      if (element) {
        await page.type(selector, value);
      }
    };

    await fillIfExists('input[name*="first"]', formData.firstName);
    await fillIfExists('input[name*="last"]', formData.lastName);
    await fillIfExists('input[name*="email"]', formData.email);
    await fillIfExists(
      'input[name*="institution"], input[name*="company"]',
      formData.institution
    );
    await fillIfExists('input[name="custom_2"]', formData.country);

    // Wait for any submit button to be available
    await page.waitForSelector('button[type="submit"]');

    // Find and click the first submit button
    const submitButton = await page.$('button[type="submit"]');

    if (submitButton) {
      // Remove any disabled attributes that might prevent clicking
      await page.evaluate(() => {
        const button = document.querySelector('button[type="submit"]');
        if (button) {
          button.removeAttribute("aria-disabled");
          button.removeAttribute("disabled");
        }
      });

      await submitButton.click();
    } else {
      throw new Error("Submit button not found");
    }

    // Wait for the m3u8 URL with timeout
    const mediaUrl = await m3u8Promise;

    return mediaUrl;
  } catch (error) {
    console.error("Error in form fill:", error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
