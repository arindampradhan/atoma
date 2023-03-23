// Remove Watermark
// https://www.watermarkremover.io/upload

const { configureBrower } = require('../utils/puppet-helpers');
const WatermarkRemover = require('../clients/WatermarkRemover');

const removeWatermarkRemover = async (fileName) => {
  const watermark = new WatermarkRemover();
  const { browser, page } = await configureBrower({ url: watermark.url });
  watermark.setPage(page);
  const file = await watermark.processFile(fileName);
  const qItem = {
    browser,
    file,
  };
  return [qItem];
};

module.exports = {
  removeWatermarkRemover,
};
