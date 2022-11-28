// Remove Background
// - https://www.remove.bg/upload
// - https://zyro.com/in/tools/image-background-remover
const { configureBrower } = require('../utils/puppet-helpers');
const Zyro = require('../models/Zyro');
const RemoveBg = require('../models/RemoveBg');

const zyroRemoveBg = async (fileName) => {
  const zyro = new Zyro();
  const { browser, page } = await configureBrower({ url: zyro.url });
  zyro.setPage(page);

  await zyro.uploadImage(fileName);
  const file = await zyro.downloadImage(page);
  return {
    browser,
    file,
  };
};

const removeBgTask = async (fileName) => {
  const removeBg = new RemoveBg();
  const { browser, page } = await configureBrower({ url: removeBg.url });
  removeBg.setPage(page);
  await removeBg.uploadImage(fileName);
  const file = await removeBg.downloadImage(page);
  return {
    browser,
    file,
  };
};

module.exports = {
  zyroRemoveBg,
  removeBgTask,
};
