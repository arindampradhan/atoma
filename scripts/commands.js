const { exec } = require('child_process');
const path = require('path');

const projectRootPath = path.join(__dirname, '..');

const runCommand = async (command) =>
  new Promise((resolve, reject) => {
    console.log('Running command: ', command, '\n');
    exec(command, (err, stdout, stderr) => {
      if (err) {
        const e = new Error(err.message);
        e.stderr = stderr;
        reject(e);
      } else {
        resolve(stdout.trim());
      }
    });
  });

module.exports = {
  getGitVersion: () => runCommand('git --version'),
  getCurrentBranch: async () => runCommand('git rev-parse --abbrev-ref HEAD'),
  getShortCommit: async () => runCommand("git log -n 1 --pretty=format:'%h'"),
  getLastCommitAuthor: async () =>
    runCommand("git log -1 --pretty=format:'%ae'"),
  runCommand,
  projectRootPath,
};
