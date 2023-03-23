/* eslint-disable camelcase */
const { copyFile } = require('fs-extra');
const { hotpotAddColors, colorPetalica } = require('../modules/color');
const { vectorizeAI } = require('../modules/image-transform');
const { zyroRemoveBg, removeBgTask } = require('../modules/remove-background');
const { BROKERS_IDS } = require('../utils/constants');
const MessageFile = require('./file');

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

  // svg
  const [f5] = await t4(f1.destFilePath);

  const f = new MessageFile(f5.file.destFilePath);
  f.setTargetBrokerId(BROKERS_IDS.Consumer);
  f.setTargetExtension('.svg');
  await copyFile(f.path, f.destFilePath);
};

module.exports = {
  combineTasks,
  t2_1,
  t2_2,
};
