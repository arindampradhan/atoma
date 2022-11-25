const {
  isProduction,
  getExtensionFromHref,
  getFileNameFromHref,
  getExtensionFromBase64,
} = require("./helpers");
const puppeteer = require('puppeteer');
const https = require('https')
const fs = require('fs')
const { v4 } = require("uuid");
const path = require("path");


const configureBrower = async ({ url }) => {
  const browser = await puppeteer.launch({
    headless: isProduction(),
    slowMo: 50,
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
  return { page, browser };
};

function downloadWithUrl(imgUrl, dest, { preserveName = false }) {
	return new Promise((resolve, reject) => {
			https.get(imgUrl, (res) => {
					const fileExt = getExtensionFromHref(imgUrl);
					const fileName = preserveName ? getFileNameFromHref() : `${v4()}.${fileExt}`;
					const stream = fs.createWriteStream(`${dest}/${fileName}`);
					res.pipe(stream);
					stream.on("finish", () => {
						stream.close();
						resolve('Success');
					});
					stream.on('error', (e) => {
						reject(e);
					})
				});
	});
}  
function downloadWithBase64(base64, dest) {
  return new Promise((resolve, reject) => {
		const fileExt = getExtensionFromBase64(base64);
		const fileName = `${v4()}.${fileExt}`;
		const base64Data = base64.replace(/^data:image\/png;base64,/, "");
		
		const fileDest = path.resolve(path.join(dest, fileName));
    fs.writeFile(fileDest, base64Data, "base64", (err) => {
      if (err) {
        reject(err);
      } else {
        resolve("success");
      }
    });
  });
}  

module.exports = {
  configureBrower,
  downloadWithUrl,
  downloadWithBase64,
};
