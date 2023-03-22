// Remove Watermark
// https://www.watermarkremover.io/upload

const { configureBrower } = require('../utils/puppet-helpers');
const WatermarkRemover = require('../clients/WatermarkRemover');

const removeWatermarkRemover = async (fileName) => {
  const removeBg = new WatermarkRemover();
  const { browser, page } = await configureBrower({ url: removeBg.url });
  removeBg.setPage(page);
  await removeBg.uploadImage(fileName);
  const file = await removeBg.downloadImage(page);
  return {
    browser,
    file,
  };
};

module.exports = {
  removeWatermarkRemover,
};
