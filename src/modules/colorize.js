// Colorize
// - https://petalica.com/index_en.html
// - https://hotpot.ai/colorize-picture

const puppeteer = require('puppeteer')
const { isProduction } = require('../utils/helpers')

async function colorize() {
	const browser = await puppeteer.launch({
		headless: isProduction(),
		slowMo: 50
  });


  await page.goto('https://petalica.com/index_en.html');
	await browser.close();
}

module.exports = colorize;