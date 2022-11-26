const { BROKERS_IDS, BROKER_FOLDER_PATH } = require('./constants');
const path = require('path');
const URL = require('url');

const isDevelopment = () => {
  return process?.env?.NODE_ENV?.toLocaleLowerCase() !== 'production';
};

const isProduction = () => {
  return process?.env?.NODE_ENV?.toLocaleLowerCase() === 'production';
};

const getBrokerPathById = (id) => {
  return path.join(BROKER_FOLDER_PATH, getKeyByValue(BROKERS_IDS, id));
};

const timeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const getFileNameFromHref = (url) => {
  const parsed = URL.parse(url);
  return path.basename(parsed.pathname);
};

const getExtensionFromHref = (url) => {
  const filename = getFileNameFromHref(url);
  return filename.split('.').pop();
};

const getExtensionFromFileName = (fileName) => {
  return path.extname(fileName).replace('.', '');
};

const getExtensionFromBase64 = (base64Data) => {
  return base64Data.substring(
    'data:image/'.length,
    base64Data.indexOf(';base64')
  );
};

const getKeyByValue = (object, value) => {
  return Object.keys(object).find((key) => object[key] === value);
};

async function waitUntil(condition, freq = 1000) {
  if (typeof condition !== 'function') {
    throw 'Condition must be function defination.';
  }
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
  getKeyByValue,
  waitUntil,
  timeout,
};
