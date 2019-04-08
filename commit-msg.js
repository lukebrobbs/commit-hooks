/*
 Copyright (C) 2018, Jaguar Land Rover - All Rights Reserved.
 CONFIDENTIAL INFORMATION - DO NOT DISTRIBUTE
*/

const fs = require("fs");
const path = require("path");
const filename = process.cwd();
const simpleGit = require("simple-git")(filename);

const message = {
  handleDiffResult(err, result, config) {
    let overSizedFiles = 0;
    for (const file of result.files) {
      const stats = fs.statSync(file.file);
      const fileSizeInBytes = stats.size;
      const fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
      if (fileSizeInMegabytes > config.maxFileSize) {
        console.log(`${file.file}: File size is too big`);
        ++overSizedFiles;
      }
    }

    if (overSizedFiles) {
      console.log(
        `Please un-stage ${overSizedFiles} oversized files before committing`
      );
      process.exit(1);
    }
    if (config.gitlabFileCheck) {
      this.fileExists("/.gitlab-ci.yml");
    }
    if (config.esLintCheck) {
      this.fileExists("/.eslintrc");
    }
  },
  fileExists(filePath) {
    if (fs.existsSync(path.join(process.env.PWD, filePath))) {
      console.log(`${filePath} file exists`);
      return true;
    } else {
      console.log(`${filePath} file does not exist`);
      process.exit(1);
    }
  },
  commitMessage(config) {
    simpleGit.diffSummary(["--cached"], (err, result) => {
      this.handleDiffResult(err, result, config);
    });
  }
};

module.exports = message;
