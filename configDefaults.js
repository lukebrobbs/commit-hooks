const defaults = {
  preCommit: {
    gitlabCi: false,
    circleCi: false,
    esLintCheck: false,
    maxFileSize: 2,
    cypress: "",
    robot: "",
    dotOnlyCheck: false
  },
  commitMsg: {
    glob: /.*/,
    maxLineLength: 79,
    titleLength: 25
  }
};

module.exports = defaults;
