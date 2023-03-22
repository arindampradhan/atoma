const puppeteer = require('puppeteer-extra');
const { executablePath } = require('puppeteer');
const https = require('https');
const fs = require('fs');
const path = require('path');
const isBase64 = require('is-base64');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const {
  isProduction,
  getExtensionFromHref,
  getExtensionFromBase64,
  waitUntil,
} = require('./helpers');
const { MessageFile } = require('../queue/file');

puppeteer.use(StealthPlugin());

const configureBrower = async ({ url }, b = null) => {
  let browser;
  if (b) {
    browser = b;
  } else {
    browser = await puppeteer.launch({
      headless: isProduction(),
      slowMo: 50,
      executablePath: executablePath(),
    });
  }

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  return { page, browser };
};

const uploadFileUsingChooser = async (target, file, page) => {
  const [fileChooser] = await Promise.all([
    page.waitForFileChooser(),
    page.click(target),
  ]);

  await fileChooser.accept([file.path]);
};

function downloadWithUrl(imgUrl, file) {
  return new Promise((resolve, reject) => {
    https.get(imgUrl, (res) => {
      try {
        const fileExt = getExtensionFromHref(imgUrl);
        file.setTargetExtension(fileExt);
        const fileDest = file.destFilePath;
        const stream = fs.createWriteStream(fileDest);
        res.pipe(stream);
        stream.on('finish', () => {
          stream.close();
          resolve(file);
        });
        stream.on('error', (e) => {
          reject(e);
        });
      } catch (error) {
        console.log(error);
      }
    });
  });
}

function downloadWithBase64(base64, file) {
  return new Promise((resolve, reject) => {
    file.setTargetExtension(`.${getExtensionFromBase64(base64).toLowerCase()}`);
    let base64Data = base64
      .replace(/^data:image\/PNG;base64,/, '')
      .replace(/^data:image\/png;base64,/, '')
      .replace(/^data:image\/JPEG;base64,/, '')
      .replace(/^data:image\/jpeg;base64,/, '')
      .replace(/^data:image\/JPG;base64,/, '')
      .replace(/^data:image\/jpg;base64,/, '');
    base64Data += base64Data.replace('+', ' ');
    // binaryData = new Buffer(base64Data, 'base64').toString('binary');

    fs.writeFile(file.destFilePath, base64Data, 'base64', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(file);
      }
    });
  });
}
/**
 * Supports base64 and url images
 */
const downloadImage = async (imageUrlOrbase64, file) => {
  try {
    if (isBase64(imageUrlOrbase64, { allowMime: true })) {
      // returns file type
      const f = await downloadWithBase64(imageUrlOrbase64, file);
      return f;
    }
    const f = await downloadWithUrl(imageUrlOrbase64, file);
    return f;
  } catch (e) {
    throw new Error('Unable to download!');
  }
};

const downloadImageWithBehaviour = async (behaviourFn, file, page) => {
  // eslint-disable-next-line node/no-unsupported-features/node-builtins
  const fp = fs.promises;
  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: file.destFolderPath,
  });

  // task
  await behaviourFn();
  // task
  const condition = () => fs.existsSync(path.resolve(file.temporaryFilePath));
  await waitUntil(condition);
  await fp.rename(
    path.resolve(file.temporaryFilePath),
    path.join(file.destFolderPath, file.destFileName)
  );
  const fl = new MessageFile(
    file.destFileName,
    path.join(file.destFolderPath, file.destFileName)
  );
  return fl;
};

module.exports = {
  configureBrower,
  downloadWithUrl,
  downloadWithBase64,
  uploadFileUsingChooser,
  downloadImage,
  downloadImageWithBehaviour,
};
