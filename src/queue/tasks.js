/* eslint-disable camelcase */
const { copyFile } = require('fs-extra');
const { hotpotAddColors, colorPetalica } = require('../modules/color');
const { vectorizeAI } = require('../modules/image-transform');
const { zyroRemoveBg, removeBgTask } = require('../modules/remove-background');
const { BROKERS_IDS } = require('../utils/constants');

const { removeWatermarkRemover } = require('../modules/remove-watermark');
const MessageFile = require('./file');

const svg = async (filePath, b = null) => {
  const result = await vectorizeAI(filePath, b);
  const [{ browser }] = result;
  if (!b) {
    await browser.close();
  }
  return result;
};

const removeBg1 = async (filePath, b = null) => {
  const result = await removeBgTask(filePath, b);
  const [{ browser }] = result;
  if (!b) {
    await browser.close();
  }
  return result;
};

const removeBg2 = async (filePath, b = null) => {
  const result = await zyroRemoveBg(filePath, b);
  const [{ browser }] = result;
  if (!b) {
    await browser.close();
  }
  return result;
};

const color2 = async (filePath, b = null) => {
  const result = await hotpotAddColors(filePath, b);
  const [{ browser }] = result;
  if (!b) {
    await browser.close();
  }
  return result;
};

const color1 = async (filePath, b = null) => {
  const result = await colorPetalica(filePath, b);
  const [{ browser }] = result;
  if (!b) {
    await browser.close();
  }
  return result;
};

const removeWatermark = async (filePath, b = null) => {
  const result = await removeWatermarkRemover(filePath, b);
  const [{ browser }] = result;
  if (!b) {
    await browser.close();
  }
  return result;
};

const combineTasks2 = async (filePath) => {
  // remove bg
  const r1 = await removeBg1(filePath);
  const { file: f1, browser: b } = r1[0];

  // svg
  const [f5] = await svg(f1.destFilePath);

  const f = new MessageFile(f5.file.destFilePath);
  f.setTargetBrokerId(BROKERS_IDS.Consumer);
  f.setTargetExtension('.svg');
  await copyFile(f.path, f.destFilePath);
};

const combineTasks = async (filePath) => {
  // remove bg
  const r1 = await removeWatermark(filePath);
  const { file: f1, browser: b } = r1[0];

  // svg
  const [f5] = await svg(f1.destFilePath);

  const f = new MessageFile(f5.file.destFilePath);
  f.setTargetBrokerId(BROKERS_IDS.Consumer);
  f.setTargetExtension('.svg');
  await copyFile(f.path, f.destFilePath);
};

module.exports = {
  combineTasks,
  color2,
  color1,
};
