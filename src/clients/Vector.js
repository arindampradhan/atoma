//  _____                           _      _
// /  __ \                         | |    | |
// | /  \/ ___  _ ____   _____ _ __| |_   | |_ ___     _____   ____ _
// | |    / _ \| '_ \ \ / / _ \ '__| __|  | __/ _ \   / __\ \ / / _` |
// | \__/\ (_) | | | \ V /  __/ |  | |_   | || (_) |  \__ \\ V / (_| |
//  \____/\___/|_| |_|\_/ \___|_|   \__|   \__\___/   |___/ \_/ \__, |
//                                                               __/ |
//                                                              |___/
const path = require('path');
const { PRODUCER_FOLDER_PATH, BROKERS_IDS } = require('../utils/constants');
const { getBrokerPathById } = require('../utils/helpers');
const {
  uploadFileUsingChooser,
  downloadImageWithBehaviour,
} = require('../utils/puppet-helpers');

class Vectorizer {
  constructor(page, url = 'https://vectorizer.ai/', accept = 'jpg,jpeg,png') {
    this.page = page;
    this.url = url;
    this.accept = accept;
    this.filenameFromProducer = '';
  }

  setPage(page) {
    this.page = page;
  }

  setFilenameFromProducer(filenameFromProducer) {
    this.filenameFromProducer = filenameFromProducer;
  }

  async uploadImage(filenameFromProducer) {
    try {
      const { page } = this;
      await uploadFileUsingChooser(
        '.FileInput-click_to_upload',
        path.join(PRODUCER_FOLDER_PATH, filenameFromProducer),
        page
      );
      this.setFilenameFromProducer(filenameFromProducer);
    } catch (error) {
      throw new Error(`Unable to upload File`);
    }
  }

  async downloadImage() {
    try {
      const { page } = this;
      await page.waitForSelector('#App-Progress-Dialog', { hidden: false });
      await page.waitForSelector('#App-Progress-Dialog', { hidden: true });
      console.log('hidden');

      const { name } = path.parse(this.filenameFromProducer);
      const downloadedFilename = `${name}.svg`;
      const downloadFilePath = path.join(
        getBrokerPathById(BROKERS_IDS.ImagetransformQueue),
        downloadedFilename
      );
      const f = await downloadImageWithBehaviour(
        async () => {
          await page.click('#App-DownloadLink');
        },
        downloadFilePath,
        page
      );

      f.setQueueId(BROKERS_IDS);
      return f;
    } catch (error) {
      throw new Error(`Unable to Process File to Queue`);
    }
  }
}

module.exports = Vectorizer;
