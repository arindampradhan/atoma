const { combineTasks } = require('./queue/tasks');

const main = async () => {
  try {
    const p =
      '/Users/ap/Documents/Atoma/image-space/Producer/Screenshot 2022-11-25 at 3.25.56 AM.png';
    const [{ browser }] = await combineTasks(p);
    await browser.close();
  } catch (error) {
    console.log(error);
  }
};

main();
