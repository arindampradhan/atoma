const path = require('path');

// project
const PROJECT_ROOT = path.join(__dirname, '..', '..');

// Image Queues
const BROKER_FOLDER_PATH = path.join(PROJECT_ROOT, 'image-space', 'Brokers');
const PRODUCER_FOLDER_PATH = path.join(PROJECT_ROOT, 'image-space', 'Producer');
const CONSUMER_FOLDER_PATH = path.join(PROJECT_ROOT, 'image-space', 'Consumer');
const IGNORED_FILES = ['.gitkeep'];

const BROKERS_IDS = {
  AutogenerateImagesQueue: 5,
  ColorizeQueue: 2,
  ImagetransformQueue: 4,
  RemoveBackgroundQueue: 1,
  RemoveWatermarkQueue: 3,
  RemoveObjectsQueue: 6,
};

module.exports = {
  IGNORED_FILES,
  PROJECT_ROOT,
  BROKER_FOLDER_PATH,
  PRODUCER_FOLDER_PATH,
  CONSUMER_FOLDER_PATH,
  BROKERS_IDS,
};
