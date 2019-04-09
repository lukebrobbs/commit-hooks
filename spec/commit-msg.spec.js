const { expect } = require("chai");
const fs = require("fs");
const sinon = require("sinon");
const { getCommitMessage } = require("../commit-msg");

describe("commit-msg()", () => {
  before(() => {
    sinon.stub(process, "exit");
    global.process.env.HUSKY_GIT_PARAMS = "spec/pre-commit.spec.js";
  });
  after(() => {
    process.exit.restore();
  });
  it("Should call process.exit with 1 if the commit message does not match the provided glob", done => {
    getCommitMessage({ commitMsg: { glob: /{a-c}/ } });
    done();
    expect(process.exit.calledWith(1)).to.be.true;
  });
  it("If the commit title is too short, should call process.exit", done => {
    global.process.env.HUSKY_GIT_PARAMS =
      "spec/mocks/short-title-commit-message.txt";
    getCommitMessage({ commitMsg: { glob: /.*/, titleLength: 25 } });
    done();
    expect(process.exit.calledWith(1)).to.be.true;
  });
  it("If the message body contains a line over the maxLineLength, should call process.exit", done => {
    global.process.env.HUSKY_GIT_PARAMS = "spec/mocks/line-length-too-long.txt";
    getCommitMessage({ commitMsg: { maxLineLength: 25, glob: /.*/ } });
    done();
    expect(process.exit.calledWith(1)).to.be.true;
  });
});
