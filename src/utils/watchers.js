const fs = require('fs');
const { PRODUCER_FOLDER_PATH } = require('./constants');

fs.watch(PRODUCER_FOLDER_PATH, { recursive: true }, (eventType, filename) => {
  if (eventType === 'change') console.log(filename, 'changed.');
});

const onProducerChange = (cb) => {
  fs.watch(PRODUCER_FOLDER_PATH, { recursive: true }, (eventType, filename) => {
    if (eventType === 'change') {
      console.log(filename, 'changed.');
      cb(eventType, filename);
    }
  });
};

module.exports = {
  onProducerChange,
};
