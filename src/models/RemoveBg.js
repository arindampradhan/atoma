// ############################
// ## Unstable | Captha present
// ############################
// Remove Background
// - https://www.remove.bg/upload
// - https://zyro.com/in/tools/image-background-remover

const path = require('path');
const { PRODUCER_FOLDER_PATH, BROKERS_IDS } = require('../utils/constants');
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

  async uploadImage(filenameFromProducer) {
    try {
      const { page } = this;
      await uploadFileUsingChooser(
        '.btn.btn-primary.btn-lg',
        path.join(PRODUCER_FOLDER_PATH, filenameFromProducer),
        page
      );
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
      const src = await el.getProperty('src');
      const imageUrl = await src.jsonValue();
      const file = await downloadImage(
        imageUrl,
        BROKERS_IDS.RemoveBackgroundQueue
      );
      return file;
    } catch (error) {
      throw new Error(`Unable to Process File to Queue`);
    }
  }
}

module.exports = RemoveBg;
