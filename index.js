const defaults = require("./configDefaults");
const conf = require("rc")("preCommit", defaults);
const { commitMessage } = require("./commit-msg");

commitMessage(conf);
