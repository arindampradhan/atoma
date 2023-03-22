//
//   ___      _     _    _____       _
//  / _ \    | |   | |  /  __ \     | |
// / /_\ \ __| | __| |  | /  \/ ___ | | ___  _ __ ___
// |  _  |/ _` |/ _` |  | |    / _ \| |/ _ \| '__/ __|
// | | | | (_| | (_| |  | \__/\ (_) | | (_) | |  \__ \
// \_| |_/\__,_|\__,_|   \____/\___/|_|\___/|_|  |___/
//
//
/*eslint class-methods-use-this: ["error", { "enforceForClassFields": true }] */
/*eslint class-methods-use-this: ["error", { "enforceForClassFields": false }] */

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
  downloadImage,
} = require('../utils/puppet-helpers');
const fs = require('fs');
const isBase64 = require('is-base64');
const { v4 } = require('uuid');
const MessageFile = require('../queue/file');

class PetalicaColorizer {
  constructor(page, url = 'https://petalica.com/index_en.html') {
    this.page = page;
    this.url = url;
    this.file = null;
  }

  setPage(page) {
    this.page = page;
  }

  setFile(filePath) {
    this.file = new MessageFile(filePath);
    console.log(this.file);
  }

  resetFile(filePath) {
    this.file = null;
    this.file = new MessageFile(filePath);
    this.file.setTargetBrokerId(BROKERS_IDS.ColorizeQueue);
    console.log(this.file);
  }

  async uploadImage(filePath) {
    try {
      const { page } = this;
      this.setFile(filePath);
      this.file.setTargetBrokerId(BROKERS_IDS.ColorizeQueue);
      const handle = await page.$('input[type="file"]');
      await handle.uploadFile(filePath);
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
      const f = await downloadImage(imageUrl, this.file);
      return f;
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
    this.file = null;
  }

  setPage(page) {
    this.page = page;
  }

  // remove this
  setOriginalFileName(originalFileName) {
    this.originalFileName = originalFileName;
  }

  setFile(filePath) {
    this.file = new MessageFile(filePath);
    console.log(this.file);
  }
  async uploadImage(filePath) {
    try {
      const { page } = this;
      this.setFile(filePath);
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
    try {
      const el = await this.page.$('#resultListBox  .targetBox img');
      const image = await el.getProperty('src');
      const imageUrl = await image.jsonValue();
      return imageUrl.startsWith('blob');
    } catch (error) {
      throw 'Error fetching image';
    }
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
      const fl = new MessageFile(
        expectedFilename,
        path.join(downloadPath, expectedFilename),
        BROKERS_IDS.ColorizeQueue
      );
      this.file = fl;
      return fl;
    } catch (e) {
      throw e;
    }
  };
}

module.exports = {
  PetalicaColorizer,
  HotpotColorizer,
};
