export interface config {
  preCommit: {
    gitlabCi: boolean;
    circleCi: boolean;
    esLintCheck: boolean;
    maxFileSize: number;
    cypress: string;
    robot: string;
    dotOnlyCheck: boolean;
  };
  commitMsg: {
    glob: string;
    maxLineLength: number;
    titleLength: number;
  };
}

export const defaults: config = {
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
    glob: ".*",
    maxLineLength: 79,
    titleLength: 25
  }
};
