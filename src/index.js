const { vectorizeAI } = require('./modules/image-transform');
const { onChannelChange } = require('./utils/watchers');

const main = async () => {
  const f =
    '/Users/ap/Documents/Atoma/image-space/Producer/Screenshot 2022-11-25 at 3.25.56 AM.png';
  const { browser } = await vectorizeAI(f);
  await browser.close();

  // onChannelChange((data, err) => {
  //   if (err) {
  //     console.log(err);
  // 	} else {
  //   }
  // });
};

main();
