// ______                                ______            _                                   _
// | ___ \                               | ___ \          | |                                 | |
// | |_/ /___ _ __ ___   _____   _____   | |_/ / __ _  ___| | ____ _ _ __ ___  _   _ _ __   __| |
// |    // _ \ '_ ` _ \ / _ \ \ / / _ \  | ___ \/ _` |/ __| |/ / _` | '__/ _ \| | | | '_ \ / _` |
// | |\ \  __/ | | | | | (_) \ V /  __/  | |_/ / (_| | (__|   < (_| | | | (_) | |_| | | | | (_| |
// \_| \_\___|_| |_| |_|\___/ \_/ \___|  \____/ \__,_|\___|_|\_\__, |_|  \___/ \__,_|_| |_|\__,_|
//                                                              __/ |
//                                                             |___/
// - https://www.remove.bg/upload
// - https://zyro.com/in/tools/image-background-remover

const path = require('path');
const MessageFile = require('../queue/file');
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

  setFile(filePath) {
    this.file = new MessageFile(filePath);
    console.log(this.file);
  }

  async processImage(filePath) {
    await this.uploadImage(filePath);
    const file = await this.downloadImage(this.page);
    return file;
  }

  async uploadImage(filePath) {
    try {
      const { page } = this;
      const handle = await page.$('input[type="file"]');
      this.setFile(filePath);
      this.file.setTargetBrokerId(BROKERS_IDS.RemoveBackgroundQueue);
      await handle.uploadFile(filePath);
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
      await downloadImage(imageUrl, this.file);
    } catch (error) {
      console.log(error);
      throw new Error(`Unable to Process File to Queue`);
    }
  }
}

module.exports = Zyro;
