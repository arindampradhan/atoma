// ______                                ______            _                                   _
// | ___ \                               | ___ \          | |                                 | |
// | |_/ /___ _ __ ___   _____   _____   | |_/ / __ _  ___| | ____ _ _ __ ___  _   _ _ __   __| |
// |    // _ \ '_ ` _ \ / _ \ \ / / _ \  | ___ \/ _` |/ __| |/ / _` | '__/ _ \| | | | '_ \ / _` |
// | |\ \  __/ | | | | | (_) \ V /  __/  | |_/ / (_| | (__|   < (_| | | | (_) | |_| | | | | (_| |
// \_| \_\___|_| |_| |_|\___/ \_/ \___|  \____/ \__,_|\___|_|\_\__, |_|  \___/ \__,_|_| |_|\__,_|
//                                                              __/ |
//                                                             |___/
//
// - https://www.remove.bg/upload
// - https://zyro.com/in/tools/image-background-remover

const MessageFile = require('../queue/file');
const { BROKERS_IDS } = require('../utils/constants');
const {
  uploadFileUsingChooser,
  downloadImage,
} = require('../utils/puppet-helpers');

class RemoveBg {
  constructor(
    page,
    url = 'https://www.remove.bg/upload',
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
    const file = await this.downloadImage();
    return file;
  }

  async uploadImage(filePath) {
    try {
      const { page } = this;
      this.setFile(filePath);
      await uploadFileUsingChooser('.btn.btn-primary.btn-lg', this.file, page);
    } catch (error) {
      console.log(error);
      throw new Error(`Unable to upload File`);
    }
  }

  async downloadImage() {
    try {
      const { page } = this;
      const el = await page.waitForSelector(
        '.img-wrapper img.img-fluid.transparency-grid'
      );
      this.file.setTargetBrokerId(BROKERS_IDS.RemoveBackgroundQueue);
      const src = await el.getProperty('src');
      const imageUrl = await src.jsonValue();
      const f = await downloadImage(imageUrl, this.file);

      return f;
    } catch (error) {
      console.log(error);
      throw new Error(`Unable to Process File to Queue`);
    }
  }
}

module.exports = RemoveBg;
