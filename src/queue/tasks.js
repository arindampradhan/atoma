const { hotpotAddColors, colorPetalica } = require('../modules/color');
const { vectorizeAI } = require('../modules/image-transform');
const { zyroRemoveBg, removeBgTask } = require('../modules/remove-background');

const t4 = async (filePath, b = null) => {
  const result = await vectorizeAI(filePath, b);
  const [{ browser }] = result;
  await browser.close();
  return result;
};

const t1_2 = async (filePath, b = null) => {
  const result = await removeBgTask(filePath, b);
  const [{ browser }] = result;
  await browser.close();
  return result;
};

const t1_1 = async (filePath, b = null) => {
  const result = await zyroRemoveBg(filePath, b);
  const [{ browser }] = result;
  await browser.close();
  return result;
};

const t2_1 = async (filePath, b = null) => {
  const result = await hotpotAddColors(filePath, b);
  const [{ browser }] = result;
  await browser.close();
  return result;
};

const t2_2 = async (filePath, b = null) => {
  const result = await colorPetalica(filePath, b);
  const [{ browser }] = result;
  await browser.close();
  return result;
};

const combineTasks = async (filePath) => {
  const r1 = await t1_2(filePath);
  const { file: f1 } = r1[0];
  const r2 = await t2_2(f1.destFilePath);
  const r3 = await t2_1(f1.destFilePath);

  r2.forEach(async ({ file }) => {
    await t4(file.destFilePath);
  });
  const { file: f2 } = r2[0];
  await t4(f2.destFilePath);
};

module.exports = {
  combineTasks,
  t2_1,
  t2_2,
};
