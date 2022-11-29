const { vectorizeAI } = require('./modules/image-transform');
// const { onProducerChange } = require('./utils/watchers');

const main = async () => {
  const { browser } = await vectorizeAI(
    'Screenshot 2022-11-25 at 3.25.56 AM.png'
  );
  await browser.close();
};

main();
