const conf = require("rc")("preCommit", {
  lintFileCheck: false,
  gitlabFileCheck: false,
  esLintCheck: false,
  maxFileSize: 2
});
const { commitMessage } = require("./commit-msg");

commitMessage(conf);
