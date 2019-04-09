const { expect } = require("chai");
const fs = require("fs");
const sinon = require("sinon");
const preCommitFunctions = require("../pre-commit");

describe("pre-commit()", () => {
  describe("handleDiffResult()", () => {
    let mockResult;
    before(() => {
      sinon.stub(process, "exit");
      sinon.spy(preCommitFunctions, "fileExists");
      mockResult = {
        files: [
          {
            file: "spec/pre-commit.spec.js",
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
      preCommitFunctions.fileExists.restore();
    });
    afterEach(() => {
      fs.statSync.restore();
    });
    it("Should exit if there are any oversized files", () => {
      sinon.stub(fs, "statSync").returns({ size: 3000000 });
      preCommitFunctions.handleDiffResult(null, mockResult, {
        maxFileSize: 2
      });
      expect(process.exit.calledWith(1)).to.be.true;
    });
    it("If the config object contains a gitlabFileCheck property, should call fileExists with the string '/.gitlab-ci.yml'", () => {
      sinon.stub(fs, "statSync").returns({ size: 30 });
      preCommitFunctions.handleDiffResult(null, mockResult, {
        maxFileSize: 2,
        gitlabFileCheck: true
      });
      expect(preCommitFunctions.fileExists.calledOnceWith("/.gitlab-ci.yml")).to
        .be.true;
      preCommitFunctions.fileExists.resetHistory();
    });
    it("If the config object does not contain a gitlabFileCheck property, should not call fileExists with the string '/.gitlab-ci.yml'", () => {
      sinon.stub(fs, "statSync").returns({ size: 30 });
      preCommitFunctions.handleDiffResult(null, mockResult, {
        maxFileSize: 2
      });
      expect(preCommitFunctions.fileExists.called).to.be.false;
    });
    it("If the config object contains a esLintCheck property, should call fileExists with the string '/.eslintrc'", () => {
      sinon.stub(fs, "statSync").returns({ size: 30 });
      preCommitFunctions.handleDiffResult(null, mockResult, {
        maxFileSize: 2,
        esLintCheck: true
      });
      expect(preCommitFunctions.fileExists.calledOnceWith("/.eslintrc")).to.be
        .true;
      preCommitFunctions.fileExists.resetHistory();
    });
    it("If the config object does not contain a esLintCheck property, should not call fileExists with the string '/.eslintrc'", () => {
      sinon.stub(fs, "statSync").returns({ size: 30 });
      preCommitFunctions.handleDiffResult(null, mockResult, {
        maxFileSize: 2
      });
      expect(preCommitFunctions.fileExists.called).to.be.false;
    });
  });
  describe("fileExists()", () => {
    it("Should returtn false if the file does not exist", () => {
      sinon.stub(fs, "existsSync").returns(false);
      expect(preCommitFunctions.fileExists("spec/pre-commit.spec.js")).to.be
        .false;
      fs.existsSync.restore();
    });
    it("Should return true if the file exists", () => {
      expect(preCommitFunctions.fileExists("spec/pre-commit.spec.js")).to.be
        .true;
    });
  });
});
