const path = require('path');
const chalk = require('chalk');
const fs = require('fs');
const merge = require('easy-pdf-merge');

const getReleaseDate = () => {
  return Date.now();
}

const paths = {
  mainFile: path.resolve(__dirname, '../document/production.pdf'),
  pdfsFolder: path.resolve(__dirname, '../pdfs/'),
  config: path.resolve(__dirname, '../pdfs/config.json'),
  releaseOut: path.resolve(__dirname, `../releases/${getReleaseDate()}.pdf`)
};

const getConfig = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(paths.config, 'utf8', (error, data) => {
      if (error) {
        reject(error);
        return
      }
      resolve(data);
    })
  })
}

const parseConfig = (config) => {
  return new Promise((resolve, reject) => {
    try {
      resolve(JSON.parse(config));
    } catch (error) {
      reject(error);
    }
  });
}

const mergePdfs = (files, out) => {
  return new Promise((resolve, reject) => {
    merge(files, out, (error) => {
      if (error) {
        reject(error);
        return;
      }
      
      resolve(null);
    });
  })
}

(async () => {
  try {
    const config = await getConfig();
    const parsed = await parseConfig(config);

    const files = parsed.order.map(name => {
      if (name === 'MAIN') {
        return paths.mainFile;
      }

      return path.resolve(paths.pdfsFolder, `${name}.pdf`);
    });

    await mergePdfs(files, paths.releaseOut);
    console.log(chalk.green('OK!'), paths.releaseOut);
  } catch (error) {
    console.log(chalk.red('Something went wrong!'));
    console.log(error);
  }
})();