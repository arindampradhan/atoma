/* eslint-disable camelcase */
const { copyFile } = require('fs-extra');
const { hotpotAddColors, colorPetalica } = require('../modules/color');
const { vectorizeAI } = require('../modules/image-transform');
const { zyroRemoveBg, removeBgTask } = require('../modules/remove-background');
const { BROKERS_IDS } = require('../utils/constants');

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
  const r1 = await t1_2(filePath);
  const { file: f1, browser: b } = r1[0];

  // add colors
  const [a, _b, c] = await t2_2(f1.destFilePath, b);
  const [d] = await t2_1(f1.destFilePath, b);
  const [f2] = await t4(a.file.destFilePath);
  const [f3] = await t4(_b.file.destFilePath);
  const [f4] = await t4(c.file.destFilePath);
  const [f5] = await t4(d.file.destFilePath);

  f1.file.setTargetBrokerId(BROKERS_IDS.Consumer);
  f2.file.setTargetBrokerId(BROKERS_IDS.Consumer);
  f3.file.setTargetBrokerId(BROKERS_IDS.Consumer);
  f4.file.setTargetBrokerId(BROKERS_IDS.Consumer);
  f5.file.setTargetBrokerId(BROKERS_IDS.Consumer);

  await copyFile(f1.file.path, f1.file.destFilePath);
  await copyFile(f2.file.path, f2.file.destFilePath);
  await copyFile(f3.file.path, f3.file.destFilePath);
  await copyFile(f4.file.path, f4.file.destFilePath);
  await copyFile(f5.file.path, f5.file.destFilePath);
};

module.exports = {
  combineTasks,
  t2_1,
  t2_2,
};
