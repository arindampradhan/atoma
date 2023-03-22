/* eslint-disable no-return-await */
const path = require('path');
const URL = require('url');
const { BROKERS_IDS, BROKER_FOLDER_PATH } = require('./constants');

const isDevelopment = () =>
  process.env.NODE_ENV.toLocaleLowerCase() !== 'production';

const isProduction = () =>
  process?.env?.NODE_ENV?.toLocaleLowerCase() === 'production';

const getKeyByValue = (object, value) =>
  Object.keys(object).find((key) => object[key] === value);

const getBrokerPathById = (id) =>
  path.join(BROKER_FOLDER_PATH, getKeyByValue(BROKERS_IDS, id));

const getBrokerIdbyFolderName = (id) => BROKER_FOLDER_PATH[id];

// eslint-disable-next-line no-promise-executor-return
const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getFileNameFromHref = (url) => {
  // eslint-disable-next-line node/no-deprecated-api
  const parsed = URL.parse(url);
  return path.basename(parsed.pathname);
};

const getExtensionFromHref = (url) => {
  const filename = getFileNameFromHref(url);
  return filename.split('.').pop();
};

const getExtensionFromFileName = (fileName) =>
  path.extname(fileName).replace('.', '');

const getExtensionFromBase64 = (base64Data) =>
  base64Data.substring('data:image/'.length, base64Data.indexOf(';base64'));

async function waitUntil(condition, freq = 1000) {
  if (typeof condition !== 'function') {
    // eslint-disable-next-line no-throw-literal
    throw 'Condition must be function defination.';
  }
  // eslint-disable-next-line no-async-promise-executor
  return await new Promise(async (resolve) => {
    const interval = setInterval(async () => {
      if (await condition()) {
        resolve(condition);
        clearInterval(interval);
      }
    }, freq);
  });
}

module.exports = {
  isDevelopment,
  isProduction,
  getBrokerPathById,
  getFileNameFromHref,
  getExtensionFromHref,
  getExtensionFromBase64,
  getExtensionFromFileName,
  getBrokerIdbyFolderName,
  getKeyByValue,
  waitUntil,
  timeout,
};
