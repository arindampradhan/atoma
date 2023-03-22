const { vectorizeAI } = require('./modules/image-transform');
const { removeBgTask } = require('./modules/remove-background');
const { onChannelChange } = require('./utils/watchers');

const task1 = async () => {
  const f =
    '/Users/ap/Documents/Atoma/image-space/Producer/Screenshot 2022-11-25 at 3.25.56 AM.png';
  const { browser, file } = await vectorizeAI(f);
  await browser.close();
};

const main = async () => {
  try {
    const f =
      '/Users/ap/Documents/Atoma/image-space/Producer/Screenshot 2022-11-25 at 3.25.56 AM.png';
    const { browser, file } = await removeBgTask(f);
    await browser.close();
  } catch (error) {
    console.log(error);
  }
};

main();
