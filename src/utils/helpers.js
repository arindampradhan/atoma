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

const getExtensionFromBase64 = (base64Data) => {
  return base64Data.substring(
    'data:image/'.length,
    base64Data.indexOf(';base64')
  );
};

const getKeyByValue = (object, value) => {
  return Object.keys(object).find((key) => object[key] === value);
};

async function waitUntil(condition) {
  return await new Promise((resolve) => {
    const interval = setInterval(() => {
      if (condition) {
        resolve('foo');
        clearInterval(interval);
      }
    }, 1000);
  });
}

module.exports = {
  isDevelopment,
  isProduction,
  getBrokerPathById,
  getFileNameFromHref,
  getExtensionFromHref,
  getExtensionFromBase64,
  getKeyByValue,
  waitUntil,
  timeout,
};
