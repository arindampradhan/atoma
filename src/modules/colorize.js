// Colorize
// - https://petalica.com/index_en.html
// - https://hotpot.ai/colorize-picture

const path = require('path');
const { configureBrower } = require('../utils/puppet-helpers');
const { PetalicaColorizer, HotpotColorizer } = require('../models/colorize');

async function colorizePetalica(fileName) {
  const petalica = new PetalicaColorizer();
  const { browser, page } = await configureBrower({ url: petalica.url });
  petalica.setPage(page);

  // close the modal
  await page.waitForSelector('#info-dialog', { visible: true });
  await page.click('button.close');

  // process all 3 filters
  await petalica.uploadImage(fileName); // 2
  await petalica.downloadImage();
  await petalica.changeFilter(1);
  await petalica.downloadImage();
  await petalica.changeFilter(0);
  await petalica.downloadImage();

  // await first.click()
  return {
    browser,
    // file,
  };
}

async function colorize(fileName) {
  const hotpot = new HotpotColorizer();
  const { browser, page } = await configureBrower({ url: hotpot.url });
  hotpot.setPage(page);
  hotpot.setOriginalFileName(fileName);

  await hotpot.uploadImage(fileName); // 2
  await hotpot.downloadImage(page);

  return {
    browser,
    // file,
  };
}

module.exports = colorize;
