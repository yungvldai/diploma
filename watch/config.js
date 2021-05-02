const chalk = require('chalk');

const onStart = (spawn) => {
  console.log(chalk.blue('Watcher is running...'));
};

const onChange = async (events, spawn) => {
  if (events.change) {
    await spawn('npm run fast-rebuild');
  }

  console.log(chalk.yellow('This is a fast rebuild. Use `npm run build` to update bibliography, table of contents and build production-ready document.'));
};

const onEnd = (spawn) => {
  console.log('Watcher is terminating.');
};

const config = {
  directory: ['./src', './lib'], // The directory which will be watched for changes. If falsy, the parent directory of this module will be watched. Can be a string or an array of strings.
  ignore: [ // ignore can be a string, regex, function or an array containing any of them. Has to be anymatch compatible, see https://github.com/es128/anymatch
      /node_modules/,
      /\.git/,
      /.*\.(aux|fls|log|fdb_latexmk)/
  ],
  delay: 250, // Delay the execution of the commands on change in ms
  verbosity: 'minimal', // Possible values are: minimal, normal, verbose
  onStart,
  onChange,
  onEnd
};

module.exports = config;