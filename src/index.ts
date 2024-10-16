import { apikey, sequence_id, showBrowser } from "./config";

import { browser } from "@crawlora/browser";

export default async function ({
  searches, // data coming from textarea which means it is multiline
}: {
  searches: string;
}) {

  const formedData = searches.trim().split("\n").map(v => v.trim())

 await browser(async ({page, wait, output, debug }) => {

    for await (const searchs of formedData) {

      await page.goto("https://google.com");

      debug(`visiting google website`)
  
      await wait(2);
  
      await page.type('textarea[name="q"]', searchs);

      debug(`looking for textarea to type`)

  
      await page.keyboard.press("Enter");

      debug(`pressing enter`)

  
      await page.waitForNavigation({ waitUntil: ["networkidle2"] });

      debug(`waiting for page navigation`)

  
      const links = await page.$$eval("a", (anchors) =>
        anchors.map((anchor) => anchor.href)
      );

      debug(`fetching links`)


      await wait(2);

      debug(`started submitting links`)

      await Promise.all(links.map(async (link) => {
        await output.create({sequence_id, sequence_output: { [searchs]: link }}) // save data per line
      }))
      
      debug(`submitted links`)

    }

  }, { showBrowser, apikey })

}
