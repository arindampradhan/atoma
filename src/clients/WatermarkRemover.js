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
const MessageFile = require('../queue/file');
const { PRODUCER_FOLDER_PATH, BROKERS_IDS } = require('../utils/constants');
const {
  uploadFileUsingChooser,
  downloadImage,
  downloadImageWithBehaviour,
} = require('../utils/puppet-helpers');

class WatermarkRemover {
  constructor(
    page,
    url = 'https://www.watermarkremover.io/upload',
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
    this.file.setTargetBrokerId(BROKERS_IDS.RemoveWatermarkQueue);
    this.file.setTargetExtension(this.file.ext);
    console.log(this.file);
  }

  async processFile(filePath) {
    await this.uploadImage(filePath);
    const file = await this.downloadImage(this.page);
    return file;
  }

  async uploadImage(filePath) {
    try {
      const { page } = this;
      this.setFile(filePath);
      await uploadFileUsingChooser('#UploadImage__HomePage', this.file, page);
    } catch (error) {
      console.log(error);
      throw new Error(`Unable to upload File`);
    }
  }

  async downloadImage() {
    try {
      const { page } = this;

      await downloadImageWithBehaviour(
        async () => {
          const [button] = await page.$x(
            "//button[contains(., 'Download Image')]"
          );
          if (button) {
            await button.click();
          }
        },
        this.file,
        page
      );

      return this.file;
    } catch (error) {
      throw new Error(`Unable to Process File to Queue`);
    }
  }
}

module.exports = WatermarkRemover;
