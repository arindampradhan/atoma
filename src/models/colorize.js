const { BROKERS_IDS, PRODUCER_FOLDER_PATH } = require('../utils/constants');
const { getBrokerPathById, timeout } = require('../utils/helpers');
const path = require('path');
const {
  downloadWithBase64,
  downloadWithUrl,
} = require('../utils/puppet-helpers');
const fs = require('fs');
const isBase64 = require('is-base64');

class PetalicaColorizer {
  constructor(page, url = 'https://petalica.com/index_en.html') {
    this.page = page;
    this.url = url;
  }

  setPage(page) {
    this.page = page;
  }

  async uploadImage(filenameFromProducer) {
    try {
      const { page } = this;
      const handle = await page.$('input[type="file"]');
      await handle.uploadFile(
        path.join(PRODUCER_FOLDER_PATH, filenameFromProducer)
      );
    } catch (error) {
      throw error;
    }
  }

  async downloadImage() {
    try {
      const { page } = this;
      // Use better condition
      // const [a,b, childNode] = await page.$('canvas');
      // const parentNode = await childNode.getProperty("parentNode");
      await timeout(8000);

      // extract image
      const [el] = await page.$x('//*[@id="paintedImage"]');
      const src = await el.getProperty('src');
      const imageUrl = await src.jsonValue();
      if (isBase64(imageUrl, { allowMime: true })) {
        return await downloadWithBase64(
          imageUrl,
          getBrokerPathById(BROKERS_IDS.ColorizeQueue)
        );
      } else {
        return await downloadWithUrl(
          imageUrl,
          getBrokerPathById(BROKERS_IDS.ColorizeQueue),
          { preserveName: false }
        );
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = {
  PetalicaColorizer,
};
