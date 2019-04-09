#!/usr/bin/env node

const fs = require("fs");
const defaults = require("./configDefaults");
const chalk = require("chalk");
const conf = require("rc")("preCommit", defaults);

const getCommitMessage = config => {
  console.log(chalk.cyan("Beginning commit message checks"));
  // checks commit message contains provided glob pattern
  const COMMIT_CONTRACT = config.commitMessageGlob;
  // gets the commit message from husky
  const message = fs.readFileSync(process.env.HUSKY_GIT_PARAMS, "utf8").trim();
  // tests message against the COMMIT_CONTRACT
  if (!COMMIT_CONTRACT.test(message)) {
    console.log(
      chalk.red(
        "Provided glob not detected in commit message. Commit rejected."
      )
    );
    process.exit(1);
    return;
  }
  console.log(chalk.green("Commit-messages checks complete"));
};

getCommitMessage(conf);

module.exports = {
  getCommitMessage
};
