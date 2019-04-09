const defaults = require("./configDefaults");
const conf = require("rc")("commithooks", defaults);
const { getCommitMessage } = require("./commit-msg");
const preCommit = require("./pre-commit");

const STAGE = process.argv[2];

if (STAGE === "-preCommit") preCommit.check(conf);

if (STAGE === "-commitMsg") getCommitMessage(conf);
