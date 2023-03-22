// Image transform
// - https://vectorizer.ai/
// - https://zyro.com/in/tools/image-upscaler

const Vectorizer = require('../clients/Vector');

const { configureBrower } = require('../utils/puppet-helpers');

async function vectorizeAI(filePath) {
  const vector = new Vectorizer();
  const { browser, page } = await configureBrower({ url: vector.url });
  vector.setPage(page);
  const file = await vector.processFile(filePath);
  const queueItem = {
    browser,
    file,
  };
  return [queueItem];
}

module.exports = { vectorizeAI };
