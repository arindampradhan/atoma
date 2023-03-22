// Remove Background
// - https://www.remove.bg/upload
// - https://zyro.com/in/tools/image-background-remover
const { configureBrower } = require('../utils/puppet-helpers');
const Zyro = require('../clients/Zyro');
const RemoveBg = require('../clients/RemoveBg');

const zyroRemoveBg = async (filePath) => {
  const zyro = new Zyro();
  const { browser, page } = await configureBrower({ url: zyro.url });
  zyro.setPage(page);
  const file = await zyro.processImage(filePath);
  const queueItem = {
    browser,
    file,
  };
  return [queueItem];
};

const removeBgTask = async (filePath) => {
  const removeBg = new RemoveBg();
  const { browser, page } = await configureBrower({ url: removeBg.url });
  removeBg.setPage(page);
  const file = await removeBg.processImage(filePath);
  const queueItem = {
    browser,
    file,
  };
  return [queueItem];
};

module.exports = {
  zyroRemoveBg,
  removeBgTask,
};
