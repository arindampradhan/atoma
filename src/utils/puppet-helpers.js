const {
  isProduction,
  getExtensionFromHref,
  getFileNameFromHref,
  getExtensionFromBase64,
  getExtensionFromUrl,
  timeout,
} = require('./helpers');
const puppeteer = require('puppeteer');
const https = require('https');
const fsStatic = require('fs');
const { v4 } = require('uuid');
const path = require('path');
const axios = require('axios');

const configureBrower = async ({ url }) => {
  const browser = await puppeteer.launch({
    headless: isProduction(),
    slowMo: 50,
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  return { page, browser };
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
      .replace(/^data:image\/png;base64,/, '')
      .replace(/^data:image\/jpeg;base64,/, '')
      .replace(/^data:image\/jpg;base64,/, '');
    base64Data += base64Data.replace('+', ' ');
    binaryData = new Buffer(base64Data, 'base64').toString('binary');

    const fileDest = path.resolve(path.join(dest, fileName));
    fsStatic.writeFile(fileDest, base64Data, 'base64', (err) => {
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

const downloadWithBlobUrl = async (
  blobUrl,
  dest,
  { preserveName = false, ext = '.png' }
) => {
  const fileName = preserveName ? getFileNameFromHref() : `${v4()}${ext}`;
  const fileDest = `${dest}/${fileName}`;
  const fs = fsStatic.promises;
  const config = { responseType: 'blob' };
  // FIXME: not downloading properly
  const res = await axios.get(blobUrl, config);
  await fs.writeFile(fileDest, res.data);
};

module.exports = {
  configureBrower,
  downloadWithUrl,
  downloadWithBlobUrl,
  downloadWithBase64,
};
