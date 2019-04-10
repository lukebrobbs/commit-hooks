const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const filename = process.cwd();
const simpleGit = require("simple-git")(filename);
import * as Config from "./configDefaults";

const preCommit = {
  handleDiffResult(
    err: null,
    result: { files: any },
    config: Config.config
  ): void {
    let overSizedFiles: number = 0;
    for (const file of result.files) {
      try {
        const stats = fs.statSync(file.file);
        const fileSizeInBytes: number = stats.size;
        const fileSizeInMegabytes: number = fileSizeInBytes / 1000000.0;
        if (fileSizeInMegabytes > config.preCommit.maxFileSize) {
          console.log(chalk.red(`${file.file}: File size is too big`));
          ++overSizedFiles;
        }
      } catch (error) {
        continue;
      }
    }

    if (overSizedFiles) {
      console.log(
        chalk.red(
          `Please un-stage ${overSizedFiles} oversized file${
            overSizedFiles > 1 ? "s" : ""
          } before committing`
        )
      );
      process.exit(1);
      return;
    }

    if (config.preCommit.dotOnlyCheck) {
      for (const file of result.files) {
        fs.readFile(file.file, "utf8", (err: null, data: string) => {
          if (data.indexOf(".only") >= 0) {
            console.log(
              chalk.red(`${file.file}: Contains a '.only', please remove`)
            );
            process.exit(1);
          }
        });
      }
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
    if (config.preCommit.circleCi) {
      if (!this.fileExists("/.circleci")) {
        console.log(
          chalk.red("No CircleCi config detected, aborting pre-commit checks")
        );
        process.exit(1);
        return;
      }
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

    if (config.preCommit.cypress && config.preCommit.cypress.length) {
      if (!this.fileExists(config.preCommit.cypress)) {
        console.log(
          chalk.red("No Cypress directory detected, aborting pre-commit checks")
        );
        process.exit(1);
        return;
      }
      console.log(chalk.cyan("Cypress directory detected"));
    }

    if (config.preCommit.robot && config.preCommit.robot.length) {
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

  fileExists(filePath: string): boolean {
    if (fs.existsSync(path.join(process.env.PWD, filePath))) {
      console.log(chalk.cyan(`${filePath} file found`));
      return true;
    } else {
      console.log(chalk.red(`${filePath} - file not detected`));
      return false;
    }
  },

  check(config: Config.config): void {
    console.log(chalk.cyan("Beginning pre-commit checks"));
    simpleGit.diffSummary(["--cached"], (err: null, result: { files: any }) => {
      this.handleDiffResult(err, result, config);
    });
  }
};

export = preCommit;
