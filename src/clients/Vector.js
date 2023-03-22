//  _____                           _      _
// /  __ \                         | |    | |
// | /  \/ ___  _ ____   _____ _ __| |_   | |_ ___     _____   ____ _
// | |    / _ \| '_ \ \ / / _ \ '__| __|  | __/ _ \   / __\ \ / / _` |
// | \__/\ (_) | | | \ V /  __/ |  | |_   | || (_) |  \__ \\ V / (_| |
//  \____/\___/|_| |_|\_/ \___|_|   \__|   \__\___/   |___/ \_/ \__, |
//                                                               __/ |
//                                                              |___/
const MessageFile = require('../queue/file');
const { BROKERS_IDS } = require('../utils/constants');
const {
  uploadFileUsingChooser,
  downloadImageWithBehaviour,
} = require('../utils/puppet-helpers');

class Vectorizer {
  constructor(page, url = 'https://vectorizer.ai/', accept = 'jpg,jpeg,png') {
    this.page = page;
    this.url = url;
    this.accept = accept;
    this.file = null;
  }

  setPage(page) {
    this.page = page;
  }

  setFile(filePath) {
    this.file = new MessageFile(filePath);
    console.log(this.file);
  }

  setFilenameFromProducer(filenameFromProducer) {
    this.filenameFromProducer = filenameFromProducer;
  }

  async processFile(filePath) {
    await this.uploadImage(filePath);
    const file = await this.downloadImage();
    return file;
  }

  async uploadImage(filePath) {
    try {
      const { page } = this;
      this.setFile(filePath);
      await uploadFileUsingChooser(
        '.FileInput-click_to_upload',
        this.file,
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
      await page.waitForSelector('#App-Progress-Dialog', { hidden: false });
      await page.waitForSelector('#App-Progress-Dialog', { hidden: true });
      this.file.setTargetBrokerId(BROKERS_IDS.ImageVectorQueue);
      this.file.setTargetExtension('.svg');
      await downloadImageWithBehaviour(
        async () => {
          await page.click('#App-DownloadLink');
        },
        this.file,
        page
      );

      return this.file;
    } catch (error) {
      console.log(error);
      throw new Error(`Unable to Process File to Queue`);
    }
  }
}

module.exports = Vectorizer;
