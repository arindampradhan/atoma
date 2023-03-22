class MessageFile {
  constructor(fileName, path, queueId) {
    this.fileName = fileName;
    this.path = path;
    this.queueId = queueId;
  }

  setQueueId(queueId) {
    this.queueId = queueId;
  }

  getFile() {
    return this.file;
  }

  read() {}

  // get the id of the queue
  getQueueId() {
    return this.queueId;
  }
}

module.exports = {
  MessageFile,
};
