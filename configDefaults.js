const defaults = {
  preCommit: {
    gitlabCi: false,
    esLintCheck: false,
    maxFileSize: 2,
    cypress: "",
    robot: ""
  },
  commitMsg: {
    glob: /.*/,
    maxLineLength: 79,
    titleLength: 25
  }
};

module.exports = defaults;
