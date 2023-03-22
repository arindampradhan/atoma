// Remove Background
// - https://www.remove.bg/upload
// - https://zyro.com/in/tools/image-background-remover

const path = require('path');
const { PRODUCER_FOLDER_PATH, BROKERS_IDS } = require('../utils/constants');
const { downloadImage } = require('../utils/puppet-helpers');

class Zyro {
  constructor(
    page,
    url = 'https://zyro.com/in/tools/image-background-remover',
    accept = 'jpg,jpeg,png'
  ) {
    this.page = page;
    this.url = url;
    this.accept = accept;
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
      throw new Error(`Unable to upload File`);
    }
  }

  async downloadImage() {
    try {
      const { page } = this;
      const el = await page.waitForSelector('.result-view__image-background');
      const image = await el.$('img');
      const src = await image.getProperty('src');
      const imageUrl = await src.jsonValue();
      await downloadImage(imageUrl, BROKERS_IDS.RemoveBackgroundQueue);
    } catch (error) {
      throw new Error(`Unable to Process File to Queue`);
    }
  }
}

module.exports = Zyro;
