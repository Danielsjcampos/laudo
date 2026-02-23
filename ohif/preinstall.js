console.log('preinstall.js');

const { exec } = require('child_process');
const log = (err, stdout, stderr) => {
  if (err) {
    console.warn('Warning: Could not set git config during preinstall. This might be fine if you already have the correct git configuration.');
    return;
  }
  console.log(stdout);
};

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
if (GITHUB_TOKEN) {
  const command = `git config --global url."https://${GITHUB_TOKEN}:x-oauth-basic@github.com/".insteadOf ssh://git@github.com/`;
  console.log(command);
  exec(command, log);
} else {
  console.log('No GITHUB_TOKEN found, skipping private repo customization');
}
