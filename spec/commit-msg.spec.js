const { expect } = require("chai");
const fs = require("fs");
const sinon = require("sinon");
const { getCommitMessage } = require("../src/commit-msg.ts");

describe("commit-msg()", () => {
  before(() => {
    sinon.stub(process, "exit");
    global.process.env.HUSKY_GIT_PARAMS = "spec/pre-commit.spec.js";
  });
  after(done => {
    process.exit.restore();
    done();
  });
  it("Should call process.exit with 1 if the commit message does not match the provided glob", done => {
    getCommitMessage({ commitMsg: { glob: /{a-c}/ } }, () => {
      expect(process.exit.calledWith(1)).to.be.true;
      done();
    });
  });
  it("If the commit title is too short, should call process.exit", done => {
    global.process.env.HUSKY_GIT_PARAMS =
      "spec/mocks/short-title-commit-message.txt";
    getCommitMessage({ commitMsg: { glob: /.*/, titleLength: 25 } }, () => {
      expect(process.exit.calledWith(1)).to.be.true;
      done();
    });
  });
  it("If the message body contains a line over the maxLineLength, should call process.exit", done => {
    global.process.env.HUSKY_GIT_PARAMS = "spec/mocks/line-length-too-long.txt";
    getCommitMessage({ commitMsg: { maxLineLength: 25, glob: /.*/ } }, () => {
      expect(process.exit.calledWith(1)).to.be.true;
      done();
    });
  });
});
