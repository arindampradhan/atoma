const path = require('path');
const { BROKERS_IDS } = require('../utils/constants');
const { getBrokerPathById } = require('../utils/helpers');

class Broker {
  constructor(id) {
    this.id = id;
  }

  get path() {
    return getBrokerPathById(this.id);
  }

  static getIdFromPath(filename) {
    const key = path.dirname(filename).split(path.sep).pop();
    return BROKERS_IDS[key];
  }

  changeBrokerId(id) {
    this.id = id;
  }
}

module.exports = Broker;
