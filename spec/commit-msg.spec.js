const { expect } = require("chai");
const fs = require("fs");
const sinon = require("sinon");
const { getCommitMessage } = require("../commit-msg");

describe("commit-msg()", () => {
  before(() => {
    sinon.stub(process, "exit");
    sinon.stub(fs, "readFileSync").returns("123456");
    global.process.env.HUSKY_GIT_PARAMS = "spec/pre-commit.spec.js";
  });
  after(() => {
    process.exit.restore();
    fs.readFileSync.restore();
  });
  it("Should call prcess.exit with 1 if the commit message does not match the provided glob", () => {
    getCommitMessage({ commitMsg: { commitMessageGlob: /{a-c}/ } });
    expect(process.exit.calledWith(1)).to.be.true;
  });
});
