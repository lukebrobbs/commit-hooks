const defaults = {
  preCommit: {
    gitlabCi: false,
    esLintCheck: false,
    maxFileSize: 2,
    cypress: "",
    robot: ""
  },
  commitMsg: {
    commitMessageGlob: /.*/
  }
};

module.exports = defaults;
