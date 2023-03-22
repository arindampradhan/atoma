/* eslint-disable no-unused-vars */
// Add Colors
// - https://petalica.com/index_en.html
// - https://hotpot.ai/colorize-picture

const path = require('path');
const { configureBrower } = require('../utils/puppet-helpers');
const { PetalicaColorizer, HotpotColorizer } = require('../clients/Addcolors');

async function colorPetalica(filePath) {
  const petalica = new PetalicaColorizer();
  const { browser, page } = await configureBrower({ url: petalica.url });
  petalica.setPage(page);

  // close the modal
  await page.waitForSelector('#info-dialog', { visible: true });
  await page.click('button.close');

  // process all 3 filters
  await petalica.uploadImage(filePath); // 2
  const result1 = await petalica.downloadImage();

  petalica.resetFile(filePath);
  await petalica.changeFilter(1);
  const result2 = await petalica.downloadImage();

  petalica.resetFile(filePath);
  await petalica.changeFilter(0);
  const result3 = await petalica.downloadImage();

  const qItem1 = {
    browser,
    file: result1,
  };

  const qItem2 = {
    browser,
    file: result2,
  };

  const qItem3 = {
    browser,
    file: result3,
  };

  return [qItem1, qItem2, qItem3];
}

async function hotpotAddColors(filePath) {
  const hotpot = new HotpotColorizer();
  const { browser, page } = await configureBrower({ url: hotpot.url });
  hotpot.setPage(page);
  // hotpot.setOriginalFileName(fileName);

  const file = await hotpot.processImage(filePath);
  const qItem = {
    browser,
    file,
  };
  return [qItem];
}

module.exports = {
  colorPetalica,
  hotpotAddColors,
};
