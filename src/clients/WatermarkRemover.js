//
//
// | |  | |     | |                               | |     | ___ \
// | |  | | __ _| |_ ___ _ __ _ __ ___   __ _ _ __| | __  | |_/ /___ _ __ ___   _____   _____ _ __
// | |/\| |/ _` | __/ _ \ '__| '_ ` _ \ / _` | '__| |/ /  |    // _ \ '_ ` _ \ / _ \ \ / / _ \ '__|
// \  /\  / (_| | ||  __/ |  | | | | | | (_| | |  |   <   | |\ \  __/ | | | | | (_) \ V /  __/ |
//  \/  \/ \__,_|\__\___|_|  |_| |_| |_|\__,_|_|  |_|\_\  \_| \_\___|_| |_| |_|\___/ \_/ \___|_|
//
//

const path = require('path');
const { PRODUCER_FOLDER_PATH, BROKERS_IDS } = require('../utils/constants');
const {
  uploadFileUsingChooser,
  downloadImage,
} = require('../utils/puppet-helpers');

class WatermarkRemover {
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
      await this.page.close();
      return file;
    } catch (error) {
      throw new Error(`Unable to Process File to Queue`);
    }
  }
}

module.exports = WatermarkRemover;
