const { onChannelChange } = require('./utils/watchers');

const main = () => {
  onChannelChange((data, err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  });
};

main();
