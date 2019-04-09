const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const filename = process.cwd();
const simpleGit = require("simple-git")(filename);

const preCommit = {
  handleDiffResult(err, result, config) {
    let overSizedFiles = 0;
    let filesWithDotOnly = [];
    for (const file of result.files) {
      const stats = fs.statSync(file.file);
      const fileSizeInBytes = stats.size;
      const fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
      if (fileSizeInMegabytes > config.preCommit.maxFileSize) {
        console.log(chalk.red(`${file.file}: File size is too big`));
        ++overSizedFiles;
      }
    }

    if (overSizedFiles) {
      console.log(
        chalk.red(
          `Please un-stage ${overSizedFiles} oversized file${
            overSizedFiles.length > 1 ? "s" : ""
          } before committing`
        )
      );
      process.exit(1);
      return;
    }
    if (config.preCommit.gitlabCi) {
      if (!this.fileExists("/.gitlab-ci.yml")) {
        console.log(
          chalk.red("No Gitlab config detected, aborting pre-commit checks")
        );
        process.exit(1);
        return;
      }
      console.log(chalk.cyan(".gitlab-ci.yml file detected"));
    }

    if (config.preCommit.esLintCheck) {
      if (!this.fileExists("/.eslintrc")) {
        console.log(
          chalk.red("No esLint config detected, aborting pre-commit checks")
        );
        process.exit(1);
        return;
      }
      console.log(chalk.cyan(".esLint file detected"));
    }

    if (config.preCommit.cypress) {
      if (!this.fileExists(config.preCommit.cypress)) {
        console.log(
          chalk.red("No Cypress directory detected, aborting pre-commit checks")
        );
        process.exit(1);
        return;
      }
      console.log(chalk.cyan("Cypress directory detected"));
    }
    if (config.preCommit.robot) {
      if (!this.fileExists(config.preCommit.robot)) {
        console.log(
          chalk.red("No Robot directory detected, aborting pre-commit checks")
        );
        process.exit(1);
        return;
      }
      console.log(chalk.cyan("Cypress directory detected"));
    }
    console.log(chalk.green("All pre-commit checks passed"));
  },
  fileExists(filePath) {
    if (fs.existsSync(path.join(process.env.PWD, filePath))) {
      console.log(chalk.cyan(`${filePath} file found`));
      return true;
    } else {
      console.log(chalk.red(`${filePath} - file not detected`));
      return false;
    }
  },
  check(config) {
    console.log(chalk.cyan("Beginning pre-commit checks"));
    simpleGit.diffSummary(["--cached"], (err, result) => {
      this.handleDiffResult(err, result, config);
    });
  }
};

module.exports = preCommit;
