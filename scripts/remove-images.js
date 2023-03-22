const { runCommand } = require('./commands');

runCommand(`cd image-space/Brokers && find . -type f -iname \*.png -delete`);
runCommand(`cd image-space/Brokers && find . -type f -iname \*.svg -delete`);
runCommand(`cd image-space/Brokers && find . -type f -iname \*.jpeg -delete`);
runCommand(`cd image-space/Brokers && find . -type f -iname \*.jpg -delete`);
