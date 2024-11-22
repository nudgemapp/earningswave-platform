import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(request: Request) {
  let browser;
  try {
    // Get ticker from URL params
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get('ticker');

    if (!ticker) {
      return NextResponse.json(
        { success: false, error: 'Ticker parameter is required' },
        { status: 400 }
      );
    }

    browser = await puppeteer.launch({
    });

    const page = await browser.newPage();
    await page.goto('https://www.marketbeat.com/earnings/conference-calls/');

    // Modified selector to find the specific ticker's earnings call link
    const earningsCallLink = await page.evaluate((tickerParam) => {
      const rows = Array.from(document.querySelectorAll('tr'));
      const targetRow = rows.find(row => {
        const tickerCell = row.querySelector('td[data-clean]');
        return tickerCell?.getAttribute('data-clean')?.startsWith(tickerParam);
      });
      
      if (!targetRow) return null;
      
      const callLink = targetRow.querySelector('a[href*="wallstreethorizon"]') as HTMLAnchorElement;
      return callLink ? callLink.href : null;
    }, ticker.toUpperCase());

    if (!earningsCallLink) {
      return NextResponse.json(
        { success: false, error: 'No earnings call found for the specified ticker' },
        { status: 404 }
      );
    }

    const audioFile = edgeMediaServerFormFill(earningsCallLink);

    return NextResponse.json({
      success: true,
      link: earningsCallLink,
      audioFile
    });

  } catch (error) {
    console.error('Error scraping earnings calls:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to scrape earnings call links',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

export const edgeMediaServerFormFill = async (link: string) => {
  let browser;
  try {
    browser = await puppeteer.launch({
        channel: 'chrome',
        headless: true
    });

    const page = await browser.newPage();
    
    // Set up the promise before any navigation
    const m3u8Promise = new Promise((resolve) => {
      page.on('request', request => {
        const url = request.url();
        if (request.method() === 'GET' && 
            url.includes('media-server.com') && 
            url.includes('.m3u8')) {
          console.log('\n=== HLS Stream URL Found ===');
          console.log('URL:', url);
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
      country: "United States"
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
    await fillIfExists('input[name*="institution"], input[name*="company"]', formData.institution);
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
          button.removeAttribute('aria-disabled');
          button.removeAttribute('disabled');
        }
      });
      
      await submitButton.click();
    } else {
      throw new Error('Submit button not found');
    }

    // Wait for the m3u8 URL with timeout
    const mediaUrl = await m3u8Promise;

    return mediaUrl;

  } catch (error) {
    console.error('Error in form fill:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}




