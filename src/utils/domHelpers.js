const axios = require('axios');
// eslint-disable-next-line import/no-extraneous-dependencies, node/no-unpublished-require
const Cheerio = require('cheerio');

const getDom = (content) => Cheerio.load(content);

const getDomFromUrl = async (url) => {
  const response = await axios.get(url);
  console.log(response);
  return getDom(response.data);
};

module.exports = {
  getDomFromUrl,
  getDom,
};
