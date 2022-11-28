const { removeBgTask, zyroRemoveBg } = require('./modules/remove-background');
const { getRandomIp } = require('./utils/helpers');
// const { onProducerChange } = require('./utils/watchers');

const main = async () => {
  const { browser } = await removeBgTask(
    'Screenshot 2022-11-25 at 3.25.56 AM.png'
  );
  await browser.close();
};

main();
