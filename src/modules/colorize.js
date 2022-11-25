// Colorize
// - https://petalica.com/index_en.html
// - https://hotpot.ai/colorize-picture

const path = require('path');
const { configureBrower } = require('../utils/puppet-helpers');
const { PetalicaColorizer } = require('../models/colorize');

async function colorize(fileName) {
  const petalica = new PetalicaColorizer();
  const { browser, page } = await configureBrower({ url: petalica.url });
  petalica.setPage(page);

  await page.waitForSelector('#info-dialog', { visible: true });
  await page.click('button.close');
  await petalica.uploadImage(fileName);
  const file = await petalica.downloadImage();
  return {
    browser,
    file,
  };
}
//*[@id="app"]/div/div[2]/div[1]/input

module.exports = colorize;
