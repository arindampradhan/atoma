const chokidar = require('chokidar');
const { PRODUCER_FOLDER_PATH, IGNORED_FILES } = require('./constants');

const watchOptions = {
  ignored: IGNORED_FILES,
  persistent: true,
  ignoreInitial: false,
  awaitWriteFinish: false,
  ignorePermissionErrors: false,
};

const watcher = chokidar.watch(PRODUCER_FOLDER_PATH, watchOptions);

const eventTypes = {
  ADD: 'add',
  CHANGE: 'change',
  UNLINK: 'unlink',
  ERROR: 'error',
};

const onChannelChange = (cb) => {
  watcher
    .on(eventTypes.ADD, (path) => {
      cb({
        type: eventTypes.ADD,
        path,
        message: `File, ${path}, has been added`,
      });
    })
    .on(eventTypes.CHANGE, (path) => {
      cb({
        type: eventTypes.CHANGE,
        path,
        message: `File, ${path}, has been added`,
      });
    })
    .on(eventTypes.UNLINK, (path) => {
      cb({
        type: eventTypes.UNLINK,
        path,
        message: `File, ${path}, has been added`,
      });
      console.log('File', path, 'has been removed');
    })
    .on(eventTypes.ERROR, (error) => cb(null, error));
};

module.exports = {
  onChannelChange,
};
