#!/usr/bin/env node

const fs = require("fs");
const chalk = require("chalk");
const readline = require("readline");

const getCommitMessage = (config, cb = () => {}) => {
  console.log(chalk.cyan("Beginning commit message checks"));
  // Contract checks commit message contains provided glob pattern
  const COMMIT_CONTRACT = config.commitMsg.glob;

  // Stream commit message
  const rl = readline.createInterface({
    input: fs.createReadStream(process.env.HUSKY_GIT_PARAMS),
    crlfDelay: Infinity
  });

  let index = 0;
  rl.on("line", line => {
    if (!index) {
      // Tests message subject against the COMMIT_CONTRACT
      if (!COMMIT_CONTRACT.test(line)) {
        console.log(
          chalk.red(
            "Provided glob not detected in commit message. Commit rejected."
          )
        );
        process.exit(1);
        rl.close();
      }
      // Checks the message subject is long enough
      if (line.length < config.commitMsg.titleLength) {
        console.log(chalk.red("Commit message subject length too short"));
        process.exit(1);
        rl.close();
      }
    }
    // Checks that no lines in the body of the commit are too long
    if (line.length > config.commitMsg.maxLineLength) {
      console.log(
        chalk.red("Commit message lines are limited to 79 characters.")
      );
      console.log(
        chalk.red(`Line ${index + 1} has ${line.length} characters.`)
      );
      console.log(chalk.red("Commit message line too long. Commit rejected."));
      process.exit(1);
      rl.close();
    }
    index++;
  });
  rl.on("close", () => {
    console.log(chalk.green("All Commit message checks passed"));
    cb();
  });
};

module.exports = {
  getCommitMessage
};
