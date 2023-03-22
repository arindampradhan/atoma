const { v4 } = require('uuid');
const path = require('path');
const {
  getBrokerPathById,
  getBrokerIdbyFolderName,
} = require('../utils/helpers');

class MessageFile {
  constructor(_path) {
    this.validatePath(_path);
    this.path = _path;
    this.id = v4();
    this.targetBrokerId = 0;
    this.targetExt = '';
  }

  // setters
  setTargetBrokerId(targetBrokerId) {
    this.targetBrokerId = targetBrokerId;
  }

  setTargetExtension(targetExt) {
    this.targetExt = targetExt;
  }

  // getters
  get destFolderPath() {
    return getBrokerPathById(this.targetBrokerId);
  }

  get destFilePath() {
    return path.join(this.destFolderPath, `${this.id}.${this.targetExt}`);
  }

  get queueName() {
    return path.basename(path.dirname(this.path));
  }

  get brokerId() {
    return getBrokerIdbyFolderName(this.queueName);
  }

  get ext() {
    return path.extname(this.path);
  }

  get destFileName() {
    return `${this.id}.${this.ext}`;
  }

  get fileName() {
    return path.basename(this.path);
  }

  // methods
  validatePath(_path) {
    if (!_path || !fs.existsSync(_path)) {
      throw new Error('Path is required!');
    }
  }
}

module.exports = MessageFile;
