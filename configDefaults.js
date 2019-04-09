const defaults = {
  preCommit: {
    lintFileCheck: false,
    gitlabFileCheck: false,
    esLintCheck: false,
    maxFileSize: 2
  },
  commitMsg: {
    commitMessageGlob: /.*/
  }
};

module.exports = defaults;
