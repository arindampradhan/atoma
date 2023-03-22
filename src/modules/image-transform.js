// Image transform
// - https://vectorizer.ai/
// - https://zyro.com/in/tools/image-upscaler

const Vectorizer = require('../models/Vectorizer');

const { configureBrower } = require('../utils/puppet-helpers');

async function vectorizeAI(fileName) {
  const vector = new Vectorizer();
  const { browser, page } = await configureBrower({ url: vector.url });
  vector.setPage(page);

  await vector.uploadImage(fileName);
  const file = await vector.downloadImage();
  return {
    file,
    browser,
  };
}

module.exports = { vectorizeAI };
