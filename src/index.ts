#!/usr/bin/env node

import * as defaults from "./configDefaults";
const rc = require("rc");
const commitMessage = require("./commit-msg");
const preCommit = require("./pre-commit");

const conf = rc("commithooks", defaults.defaults);
const { getCommitMessage } = commitMessage;

const STAGE = process.argv[2];

if (STAGE === "-preCommit") preCommit.check(conf);

if (STAGE === "-commitMsg") getCommitMessage(conf);
