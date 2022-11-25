// Colorize
// - https://petalica.com/index_en.html
// - https://hotpot.ai/colorize-picture

const puppeteer = require("puppeteer");
const { BROKERS_IDS, PRODUCER_FOLDER_PATH } = require("../utils/constants");
const {
  isProduction,
  getBrokerPathById,
  timeout,
} = require("../utils/helpers");
const path = require("path");
const {
  configureBrower,
  downloadWithBase64,
  downloadWithUrl,
} = require("../utils/puppet-helpers");
const fs = require("fs");
const isBase64 = require("is-base64");

async function colorize(filePath) {
  const { browser, page } = await configureBrower({
    url: "https://petalica.com/index_en.html",
  });
  await page.waitForSelector("#info-dialog", { visible: true });
  await page.click("button.close");
  const handle = await page.$('input[type="file"]');
  await handle.uploadFile(
    path.join(PRODUCER_FOLDER_PATH, "Screenshot 2022-11-25 at 3.25.56 AM.png")
  );
  // const [a,b, childNode] = await page.$('canvas');
  // const parentNode = await childNode.getProperty("parentNode");

  await timeout(8000);
  const [el] = await page.$x('//*[@id="paintedImage"]');
  const src = await el.getProperty("src");
  const imageUrl = await src.jsonValue();

  if (isBase64(imageUrl, { allowMime: true })) {
    await downloadWithBase64(
      imageUrl,
      getBrokerPathById(BROKERS_IDS.ColorizeQueue)
    );
  } else {
    await downloadWithUrl(
      imageUrl,
      getBrokerPathById(BROKERS_IDS.ColorizeQueue),
      { preserveName: false }
    );
  }

  console.log("done");

  // const light = '//*[@id="app"]/div/div[1]/div[3]/div[2]/div[1]/label[1]';
  // const medium = '//*[@id="app"]/div/div[1]/div[3]/div[2]/div[1]/label[2]';
  // const aggressive = '//*[@id="app"]/div/div[1]/div[3]/div[2]/div[1]/label[3]';
  // const message = '//*[@id="app"]/div/div[1]/div[3]/div[3]/div/p';

  // const l = await page.$x(light);
  // await l.click();

  // await page.waitForXPath('//*[@id="app"]/div/div[1]/div[3]/div[3]/div', { visible: true })
  // await page.waitForXPath('//*[@id="app"]/div/div[1]/div[3]/div[3]/div', { visible: false })

  // await page.click(medium);
  // await page.click(aggressive);

  // const output = getBrokerPathById(BROKERS_IDS.ColorizeQueue)
  // const input = await fileChooser.accept([
  //   path.join(PRODUCER_FOLDER_PATH, "Screenshot 2022-11-25 at 3.25.56 AM.png"),
  // ]);

  await browser.close();
}
//*[@id="app"]/div/div[2]/div[1]/input

module.exports = colorize;
