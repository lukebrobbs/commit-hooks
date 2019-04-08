const { expect } = require("chai");
const fs = require("fs");
const filename = process.cwd();
const simpleGit = require("simple-git")(filename);
const sinon = require("sinon");
const commitMessageFunctions = require("../commit-msg");

describe("commit-msg()", () => {
  describe("handleDiffResult()", () => {
    let mockResult;
    before(() => {
      sinon.stub(process, "exit");
      sinon.spy(commitMessageFunctions, "fileExists");
      mockResult = {
        files: [
          {
            file: "spec/commit-msg.spec.js",
            changes: 17,
            insertions: 15,
            deletions: 2,
            binary: false
          }
        ]
      };
    });
    after(() => {
      process.exit.restore();
      commitMessageFunctions.fileExists.restore();
    });
    afterEach(() => {
      fs.statSync.restore();
    });
    it("Should exit if there are any oversized files", () => {
      sinon.stub(fs, "statSync").returns({ size: 3000000 });
      commitMessageFunctions.handleDiffResult(null, mockResult, {
        maxFileSize: 2
      });
      expect(process.exit.calledWith(1)).to.be.true;
    });
    it("If the config object contains a gitlabFileCheck property, should call fileExists with the string '/.gitlab-ci.yml'", () => {
      sinon.stub(fs, "statSync").returns({ size: 30 });
      commitMessageFunctions.handleDiffResult(null, mockResult, {
        maxFileSize: 2,
        gitlabFileCheck: true
      });
      expect(
        commitMessageFunctions.fileExists.calledOnceWith("/.gitlab-ci.yml")
      ).to.be.true;
      commitMessageFunctions.fileExists.resetHistory();
    });
    it("If the config object does not contain a gitlabFileCheck property, should not fileExists with the string '/.gitlab-ci.yml'", () => {
      sinon.stub(fs, "statSync").returns({ size: 30 });
      commitMessageFunctions.handleDiffResult(null, mockResult, {
        maxFileSize: 2
      });
      expect(commitMessageFunctions.fileExists.called).to.be.false;
    });
    it("If the config object contains a esLintCheck property, should call fileExists with the string '/.eslintrc'", () => {
      sinon.stub(fs, "statSync").returns({ size: 30 });
      commitMessageFunctions.handleDiffResult(null, mockResult, {
        maxFileSize: 2,
        esLintCheck: true
      });
      expect(commitMessageFunctions.fileExists.calledOnceWith("/.eslintrc")).to
        .be.true;
      commitMessageFunctions.fileExists.resetHistory();
    });
    it("If the config object does not contain a esLintCheck property, should not fileExists with the string '/.eslintrc'", () => {
      sinon.stub(fs, "statSync").returns({ size: 30 });
      commitMessageFunctions.handleDiffResult(null, mockResult, {
        maxFileSize: 2
      });
      expect(commitMessageFunctions.fileExists.called).to.be.false;
    });
  });
  describe("fileExists()", () => {
    it("Should call process exit if the file does not exist", () => {
      sinon.stub(process, "exit");
      sinon.stub(fs, "existsSync").returns(false);
      commitMessageFunctions.fileExists("spec/commit-msg.spec.js");
      expect(process.exit.calledWith(1)).to.be.true;
      process.exit.restore();
      fs.existsSync.restore();
    });
    it("Should return true if the file exists", () => {
      expect(commitMessageFunctions.fileExists("spec/commit-msg.spec.js")).to.be
        .true;
    });
  });
});
