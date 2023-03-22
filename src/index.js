const { petalicaAddColors, colorPetalica } = require('./modules/color');
const { vectorizeAI } = require('./modules/image-transform');
const { zyroRemoveBg } = require('./modules/remove-background');

const { onChannelChange } = require('./utils/watchers');

const task1 = async () => {
  const f =
    '/Users/ap/Documents/Atoma/image-space/Producer/Screenshot 2022-11-25 at 3.25.56 AM.png';
  const { browser, file } = await vectorizeAI(f);
  await browser.close();
};

const task2 = async () => {
  const p =
    '/Users/ap/Documents/Atoma/image-space/Producer/Screenshot 2022-11-25 at 3.25.56 AM.png';
  const { browser, file } = await removeBgTask(p);
  await browser.close();
};

const task3 = async () => {
  const p =
    '/Users/ap/Documents/Atoma/image-space/Producer/Screenshot 2022-11-25 at 3.25.56 AM.png';
  const [{ browser, file }] = await zyroRemoveBg(p);
  await browser.close();
};

const main = async () => {
  try {
    const p =
      '/Users/ap/Documents/Atoma/image-space/Producer/Screenshot 2022-11-25 at 3.25.56 AM.png';
    const [{ browser, file }] = await colorPetalica(p);
    await browser.close();
  } catch (error) {
    console.log(error);
  }
};

main();
