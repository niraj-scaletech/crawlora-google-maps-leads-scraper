import debug from "debug";
import { apikey, sequence_id, showBrowser } from "./config";
import { browser } from "@crawlora/browser";

export default async function ({ keywords }: { keywords: string }) {
  const formedData = keywords.trim().split("\n").map(v => v.trim())

  await browser(async ({ page, wait, output, debug }) => {
    try {
      const allCollectedData: Record<string, string | number>[] = [];

      for await (const keyword of formedData) {
        // Navigate to Google Maps
        await page.goto("https://www.google.com/maps", {
          waitUntil: "networkidle2",
          timeout: 60000,
        });

        // Clear the search box and enter the query
        await page.waitForSelector("input#searchboxinput", { timeout: 10000 });
        await page.click("input#searchboxinput");
        await page.type("input#searchboxinput", keyword);
        await page.keyboard.press("Enter");

        await page.waitForNavigation({ waitUntil: ['networkidle2'] });

        await scrollToBottomUntilEndMessage(page, wait);
        debug("All results loaded...");

        const elements = await page.$$('a.hfpxzc');
        debug(`Found ${elements.length} elements.`);


        for (const element of elements) {
          await element.click();
          await page.waitForSelector('div[role="main"]', { timeout: 5000 });

          const elementData = await extractElementData(page);
          if (elementData) allCollectedData.push({ keyword, ...elementData });

          await wait(1);
        }
      }
      await submitData(allCollectedData, output, debug);
    } catch (error) {
      debug(error)
      throw error
    }
  }, { showBrowser, apikey })

}

// Scroll until the "end of list" message is found.
async function scrollToBottomUntilEndMessage(page: any, wait: any) {
  await page.waitForSelector('div[role="feed"]', { timeout: 30000 });

  let endOfResults = false;
  while (!endOfResults) {
    await page.evaluate(() => {
      const feed = document.querySelector('div[role="feed"]');
      if (feed) feed.scrollTop = feed.scrollHeight;
    });

    await wait(2);

    endOfResults = await page.evaluate(() => {
      const endMessage = document.querySelector('.HlvSq')?.textContent;
      return endMessage?.includes("You've reached the end of the list.");
    });
  }
}

// Extract data from the element's detail view.
async function extractElementData(page: any) {
  return await page.evaluate(() => {
    const mainDiv = document.querySelectorAll('div[role="main"]')[1];
    if (!mainDiv) return null;

    const getText = (selector: string) =>
      mainDiv.querySelector(selector)?.textContent?.trim() || 'N/A';

    const getSrc = (selector: string) =>
      (mainDiv.querySelector(selector) as HTMLImageElement)?.src || 'N/A';

    const getButtonText = (selector: string) =>
      mainDiv.querySelector(selector)?.firstChild?.lastChild?.textContent?.trim() || 'N/A';

    return {
      title: getText('h1'),
      image: getSrc('img'),
      reviews: getText('.F7nice > :nth-child(2)').replace(/\(|\)/g, ''),
      ratings: getText('.F7nice > :nth-child(1)'),
      address: getButtonText('button[data-item-id="address"]'),
      website: (mainDiv.querySelector('a[data-item-id="authority"]') as HTMLAnchorElement)?.href || 'N/A',
      phoneNumber: getButtonText('button[data-item-id^="phone:"]'),
      plusCode: getButtonText('button[data-item-id="oloc"]'),
      category: getText('.DkEaL'),
      description: getText('.PYvSYb'),
    };
  });
}

// Submit collected data to the output.
async function submitData(
  mapData: Record<string, string | number>[],
  output: any,
  debug: debug.Debugger
) {
  await Promise.all(
    mapData.map(async (data, index) => {
      await output.create({
        sequence_id,
        sequence_output: {
          Keyword: data.keyword,
          Title: data.title,
          Image: data.image,
          Reviews: data.reviews,
          Ratings: data.ratings,
          Address: data.address,
          Website: data.website,
          PhoneNumber: data.phoneNumber,
          PlusCode: data.plusCode,
          Category: data.category,
          Description: data.description,
          ResultNumber: index + 1,
        },
      });
    })
  );
  debug("Data submitted successfully.");
}