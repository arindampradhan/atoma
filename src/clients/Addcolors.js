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

const { BROKERS_IDS } = require('../utils/constants');
const { timeout, waitUntil } = require('../utils/helpers');
const path = require('path');
const { downloadImage } = require('../utils/puppet-helpers');
const fs = require('fs');
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
    this.file.setTargetBrokerId(BROKERS_IDS.ColorizeQueue);
    console.log(this.file);
  }

  resetFile(filePath) {
    this.file = null;
    this.file = new MessageFile(filePath);
    this.file.setTargetBrokerId(BROKERS_IDS.ColorizeQueue);
  }

  async uploadImage(filePath) {
    try {
      const { page } = this;
      this.setFile(filePath);
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
    this.file.setTargetBrokerId(BROKERS_IDS.ColorizeQueue);
    this.file.setTargetExtension(this.file.ext);
  }

  async processImage(filePath) {
    await this.uploadImage(filePath); // 2
    return await this.downloadImage(this.page);
  }

  async uploadImage(filePath) {
    try {
      const { page } = this;
      this.setFile(filePath);
      const [el] = await page.$x('//*[@id="controlBox"]/div[2]/div/label[5]');
      await el.click();
      const handle = await page.$('input[type="file"]');
      await handle.uploadFile(filePath);
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
      const downloadedFilename = `Hotpot${this.file.ext}`;

      const client = await page.target().createCDPSession();
      await client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: this.file.destFolderPath,
      });

      await page.waitForSelector('.statusBox', { visible: true });
      await page.waitForSelector('.statusBox', { visible: false });
      await waitUntil(this.isImageReady);

      const el = await page.$('#resultListBox  .targetBox img');
      await el.click();
      const condition = () =>
        fs.existsSync(path.join(this.file.destFolderPath, downloadedFilename));
      await waitUntil(condition);
      // FIXME: deetFilePath is missing extension
      await f.rename(
        path.join(this.file.destFolderPath, downloadedFilename),
        this.file.destFilePath
      );
      await this.page.close();

      return this.file;
    } catch (e) {
      throw e;
    }
  };
}

module.exports = {
  PetalicaColorizer,
  HotpotColorizer,
};
