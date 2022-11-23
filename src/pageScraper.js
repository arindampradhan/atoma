const scraperObject = {
  //Change url to link you're scraping from
  url: 'https://google.com',
  async scraper(browser){
      let page = await browser.newPage();
      console.log(`Navigating to ${this.url}...`);
      await page.goto(this.url);
      await page.waitForTimeout(5000)
      //Enter following code here



      //Program successfully completed
      await browser.close();
      console.log('Program completed!')
  }
}

module.exports = scraperObject;
