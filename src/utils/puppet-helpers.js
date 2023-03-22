const puppeteer = require('puppeteer-extra');
const { executablePath } = require('puppeteer');
const https = require('https');
const fs = require('fs');
const { v4 } = require('uuid');
const path = require('path');
const isBase64 = require('is-base64');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const {
  isProduction,
  getExtensionFromHref,
  getFileNameFromHref,
  getExtensionFromBase64,
  getBrokerPathById,
  getExtensionFromFileName,
  waitUntil,
} = require('./helpers');
const { MessageFile } = require('../queue/file');

puppeteer.use(StealthPlugin());

const configureBrower = async ({ url }) => {
  const browser = await puppeteer.launch({
    headless: isProduction(),
    slowMo: 50,
    executablePath: executablePath(),
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  return { page, browser };
};

const uploadFileUsingChooser = async (target, filePath, page) => {
  const [fileChooser] = await Promise.all([
    page.waitForFileChooser(),
    page.click(target),
  ]);

  await fileChooser.accept([filePath]);
};

function downloadWithUrl(imgUrl, dest, { preserveName = false }) {
  return new Promise((resolve, reject) => {
    https.get(imgUrl, (res) => {
      const fileExt = getExtensionFromHref(imgUrl);
      const fileName = preserveName
        ? getFileNameFromHref()
        : `${v4()}.${fileExt}`;
      const fileDest = `${dest}/${fileName}`;
      const stream = fs.createWriteStream(fileDest);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close();
        resolve({
          path: fileDest,
          fileName,
        });
      });
      stream.on('error', (e) => {
        reject(e);
      });
    });
  });
}

function downloadWithBase64(base64, dest) {
  return new Promise((resolve, reject) => {
    const fileExt = getExtensionFromBase64(base64);
    const fileName = `${v4()}.${fileExt}`;
    let base64Data = base64
      .replace(/^data:image\/PNG;base64,/, '')
      .replace(/^data:image\/png;base64,/, '')
      .replace(/^data:image\/JPEG;base64,/, '')
      .replace(/^data:image\/jpeg;base64,/, '')
      .replace(/^data:image\/JPG;base64,/, '')
      .replace(/^data:image\/jpg;base64,/, '');
    base64Data += base64Data.replace('+', ' ');
    // binaryData = new Buffer(base64Data, 'base64').toString('binary');

    const fileDest = path.resolve(path.join(dest, fileName));
    fs.writeFile(fileDest, base64Data, 'base64', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          path: fileDest,
          fileName,
        });
      }
    });
  });
}
/**
 * Supports base64 and url images
 */
const downloadImage = async (imageUrl, brokerId) => {
  try {
    if (isBase64(imageUrl, { allowMime: true })) {
      const result = await downloadWithBase64(
        imageUrl,
        getBrokerPathById(brokerId)
      );
      const f = new MessageFile(result.fileName, result.path);
      return f;
    }
    const result = await downloadWithUrl(
      imageUrl,
      getBrokerPathById(brokerId),
      {
        preserveName: false,
      }
    );
    const f = new MessageFile(result.fileName, result.path, brokerId);
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
