/* eslint-disable camelcase */
const { hotpotAddColors, colorPetalica } = require('../modules/color');
const { vectorizeAI } = require('../modules/image-transform');
const { zyroRemoveBg, removeBgTask } = require('../modules/remove-background');

const t4 = async (filePath, b = null) => {
  const result = await vectorizeAI(filePath, b);
  const [{ browser }] = result;
  if (!b) {
    await browser.close();
  }
  return result;
};

const t1_2 = async (filePath, b = null) => {
  const result = await removeBgTask(filePath, b);
  const [{ browser }] = result;
  if (!b) {
    await browser.close();
  }
  return result;
};

const t1_1 = async (filePath, b = null) => {
  const result = await zyroRemoveBg(filePath, b);
  const [{ browser }] = result;
  if (!b) {
    await browser.close();
  }
  return result;
};

const t2_1 = async (filePath, b = null) => {
  const result = await hotpotAddColors(filePath, b);
  const [{ browser }] = result;
  if (!b) {
    await browser.close();
  }
  return result;
};

const t2_2 = async (filePath, b = null) => {
  const result = await colorPetalica(filePath, b);
  const [{ browser }] = result;
  if (!b) {
    await browser.close();
  }
  return result;
};

const combineTasks = async (filePath) => {
  // remove bg
  const r1 = await t1_1(filePath);
  const { file: f1, browser: b } = r1[0];

  // add colors
  const r2 = await t2_2(f1.destFilePath, b);
  const r3 = await t2_1(f1.destFilePath, b);

  let r2_results = [];
  r2.forEach(async ({ file }) => {
    const r = await t4(file.destFilePath, b);
    r2_results = [...r2_results, ...r];
  });
  r2_results = [...r2_results, ...r3];

  let r4_results = [];
  r2.forEach(async ({ file }) => {
    const r = await t4(file.destFilePath, b);
    r4_results = [...r4_results, ...r];
  });

  return r4_results;
};

module.exports = {
  combineTasks,
  t2_1,
  t2_2,
};
