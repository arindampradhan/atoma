const { combineTasks } = require('./queue/tasks');
const { onChannelChange, watcherEvents } = require('./utils/watchers');

const main = async () => {
  onChannelChange((data, err) => {
    if (err) {
      console.log(err);
    } else if ([watcherEvents.ADD, watcherEvents.CHANGE].includes(data.type)) {
      combineTasks(data.path);
    }
  });
};

main();
