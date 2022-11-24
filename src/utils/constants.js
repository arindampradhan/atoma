const path = require('path');

const PROJECT_ROOT = path.join(__dirname,'..', '..')

const BROKER_FOLDER_PATH = path.join(PROJECT_ROOT, "image-space", "Brokers");
const PRODUCER_FOLDER_PATH = path.join(
  PROJECT_ROOT,
  "image-space",
  "Producer"
);
const CONSUMER_FOLDER_PATH = path.join(PROJECT_ROOT, 'image-space', 'Consumer');

module.exports = {
	PROJECT_ROOT,
	BROKER_FOLDER_PATH,
	PRODUCER_FOLDER_PATH,
	CONSUMER_FOLDER_PATH,
}