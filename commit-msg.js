#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const defaults = require("./configDefaults");
const conf = require("rc")("preCommit", defaults);

const getCommitMessage = config => {
  // checks for message starting with `SPC-{JIRA_NUMBER}`
  const COMMIT_CONTRACT = config.commitMessageGlob;
  // gets the commit message from husky
  const message = fs.readFileSync(process.env.HUSKY_GIT_PARAMS, "utf8").trim();
  // tests message against the COMMIT_CONTRACT
  if (!COMMIT_CONTRACT.test(message)) {
    console.log("No Jira issue detected in commit message. Commit rejected.");
    process.exit(1);
  }
  console.log("Commit-messages checks complete");
};

getCommitMessage(conf);
