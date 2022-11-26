const { BROKERS_IDS, PRODUCER_FOLDER_PATH } = require('../utils/constants');
const {
  getBrokerPathById,
  timeout,
  getExtensionFromFileName,
  waitUntil,
} = require('../utils/helpers');
const path = require('path');
const {
  downloadWithBase64,
  downloadWithUrl,
} = require('../utils/puppet-helpers');
const fs = require('fs');
const isBase64 = require('is-base64');
const { v4 } = require('uuid');

class PetalicaColorizer {
  constructor(page, url = 'https://petalica.com/index_en.html') {
    this.page = page;
    this.url = url;
    this.filepath = '';
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
      await timeout(8000);
      // extract image
      const [el] = await page.$x('//*[@id="paintedImage"]');
      const src = await el.getProperty('src');
      const imageUrl = await src.jsonValue();
      if (isBase64(imageUrl, { allowMime: true })) {
        const result = await downloadWithBase64(
          imageUrl,
          getBrokerPathById(BROKERS_IDS.ColorizeQueue)
        );
        this.filepath = result.path;
        return result;
      } else {
        const result = downloadWithUrl(
          imageUrl,
          getBrokerPathById(BROKERS_IDS.ColorizeQueue),
          { preserveName: false }
        );
        this.filepath = result.path;
        return result;
      }
    } catch (error) {
      throw error;
    }
  }

  async changeFilter(index) {
    const { page } = this;
    const [parent] = await page.$x(
      '//*[@id="app"]/div/div[1]/div[3]/div[2]/div[1]'
    );
    const choices = await parent.$x('//label');
    await choices[index].click();
  }
}

class HotpotColorizer {
  constructor(page, url = 'https://hotpot.ai/colorize-picture') {
    this.page = page;
    this.url = url;
    this.originalFileName = '';
    this.filepath = '';
  }

  setPage(page) {
    this.page = page;
  }

  setOriginalFileName(originalFileName) {
    this.originalFileName = originalFileName;
  }

  async uploadImage(filenameFromProducer) {
    try {
      const { page } = this;
      const [el] = await page.$x('//*[@id="controlBox"]/div[2]/div/label[5]');
      await el.click();
      const handle = await page.$('input[type="file"]');
      await handle.uploadFile(
        path.join(PRODUCER_FOLDER_PATH, filenameFromProducer)
      );
      await page.$eval('#submitButton', (el) => el.click());
    } catch (error) {
      throw error;
    }
  }

  isImageReady = async () => {
    const el = await this.page.$('#resultListBox  .targetBox img');
    const image = await el.getProperty('src');
    const imageUrl = await image.jsonValue();
    console.log(imageUrl);
    return imageUrl.startsWith('blob');
  };

  downloadImage = async () => {
    try {
      const { page } = this;
      const f = fs.promises;
      const fileExt = getExtensionFromFileName(this.originalFileName);
      const expectedFilename = `${v4()}.${fileExt}`;
      const downloadedFilename = `Hotpot.${fileExt}`;
      const downloadPath = getBrokerPathById(BROKERS_IDS.ColorizeQueue);

      const client = await page.target().createCDPSession();
      await client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath,
      });

      await page.waitForSelector('.statusBox', { visible: true });
      await page.waitForSelector('.statusBox', { visible: false });
      await waitUntil(this.isImageReady);

      const el = await page.$('#resultListBox  .targetBox img');
      await el.click();
      const condition = () =>
        fs.existsSync(path.join(downloadPath, downloadedFilename));
      await waitUntil(condition);
      await f.rename(
        path.join(downloadPath, downloadedFilename),
        path.join(downloadPath, expectedFilename)
      );
      this.filepath = path.join(downloadPath, expectedFilename);
    } catch (e) {
      throw e;
    }
  };
}

module.exports = {
  PetalicaColorizer,
  HotpotColorizer,
};
