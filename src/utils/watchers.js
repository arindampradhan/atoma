const { PRODUCER_FOLDER_PATH } = require("./constants");
const fs = require("fs");

fs.watch(PRODUCER_FOLDER_PATH, { recursive: true }, (eventType, filename) => {
  if (eventType === "change") console.log(filename, "changed.");
});

const onProducerChange = (cb) => {
  fs.watch(PRODUCER_FOLDER_PATH, { recursive: true }, (eventType, filename) => {
    if (eventType === "change") {
      console.log(filename, "changed.");
      cb(eventType, filename);
    }
  });
};

module.exports = {
  onProducerChange,
};
