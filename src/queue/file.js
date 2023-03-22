const { v4 } = require('uuid');
const path = require('path');
const fs = require('fs');
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
    this.validateExtension(targetExt);
    this.targetExt = targetExt;
  }

  // getters
  get destFolderPath() {
    return getBrokerPathById(this.targetBrokerId);
  }

  get destFilePath() {
    return path.join(this.destFolderPath, this.destFileName);
  }

  get targetQueueName() {
    return path.basename(path.dirname(this.destFilePath));
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

  get temporaryFilePath() {
    return path.join(
      this.destFolderPath,
      `${this.fileNameOnly}${this.targetExt}`
    );
  }

  get destFileName() {
    return `${this.id}${this.targetExt}`;
  }

  get fileName() {
    return path.basename(this.path);
  }

  get fileNameOnly() {
    return path.parse(this.fileName).name;
  }

  // methods
  validatePath(_path) {
    if (!_path || !fs.existsSync(_path)) {
      throw new Error('Path is required!');
    }
  }

  validateExtension(ext) {
    if (!['.svg', '.png', '.jpg', '.jpeg'].includes(ext)) {
      throw new Error('Invalid extension!');
    }
  }
}

module.exports = MessageFile;
