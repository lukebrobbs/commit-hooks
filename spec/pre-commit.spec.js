const { expect } = require("chai");
const fs = require("fs");
const sinon = require("sinon");
const preCommitFunctions = require("../src/pre-commit.ts");

describe("pre-commit()", () => {
  describe("handleDiffResult()", () => {
    let mockResult;
    let statSyncMock;
    let readFileMock;
    let exitMock;
    let exit;
    before(() => {
      exitMock = sinon.stub(process, "exit");
      statSyncMock = sinon.stub(fs, "statSync");
      readFileMock = sinon.stub(fs, "readFile");
      sinon.spy(preCommitFunctions, "fileExists");

      mockResult = {
        files: [
          {
            file: "spec/mocks/line-length-too-long.txt",
            changes: 17,
            insertions: 15,
            deletions: 2,
            binary: false
          }
        ]
      };
    });
    beforeEach(() => {
      statSyncMock.returns({ size: 1 });
      readFileMock.yields(null, "no dot only here");
    });
    afterEach(done => {
      exitMock.resetHistory();
      preCommitFunctions.fileExists.resetHistory();
      statSyncMock.reset();
      readFileMock.reset();
      done();
    });
    it("Should exit if there are any oversized files", done => {
      statSyncMock.returns({ size: 3000000 });
      preCommitFunctions.handleDiffResult(null, mockResult, {
        preCommit: {
          maxFileSize: 2
        }
      });
      expect(statSyncMock.callCount).to.equal(1);
      expect(process.exit.callCount).to.equal(1);
      done();
    });
    it("If dotOnlyCheck set to true, should exit if any files contain a dot only", done => {
      const newMock = JSON.parse(JSON.stringify(mockResult));
      newMock.files[0].file = "spec/mocks/file-with-only.txt";
      readFileMock.yields(null, "there is a .only here");
      preCommitFunctions.handleDiffResult(null, newMock, {
        preCommit: {
          maxFileSize: 2,
          dotOnlyCheck: true
        }
      });
      expect(readFileMock.callCount).to.equal(1);
      expect(process.exit.callCount).to.equal(1);
      done();
    });
    it("If dotOnlyCheck set to false, should not call process.exit if .only present", done => {
      const newMock = JSON.parse(JSON.stringify(mockResult));
      newMock.files[0].file = "spec/mocks/file-with-only.txt";
      readFileMock.yields(null, "there is a .only here");
      preCommitFunctions.handleDiffResult(null, newMock, {
        preCommit: {
          maxFileSize: 2
        }
      });
      expect(readFileMock.called).to.be.false;
      expect(process.exit.called).to.be.false;
      done();
    });
    it("If the config object contains a gitlabCi property, should call fileExists with the string '/.gitlab-ci.yml'", done => {
      preCommitFunctions.handleDiffResult(null, mockResult, {
        preCommit: {
          maxFileSize: 2,
          gitlabCi: true
        }
      });
      expect(preCommitFunctions.fileExists.calledOnceWith("/.gitlab-ci.yml")).to
        .be.true;
      done();
    });
    it("If the config object does not contain a gitlabCi property, should not call fileExists with the string '/.gitlab-ci.yml'", done => {
      preCommitFunctions.handleDiffResult(null, mockResult, {
        preCommit: {
          maxFileSize: 2
        }
      });
      expect(preCommitFunctions.fileExists.called).to.be.false;
      done();
    });
    it("If the config object contains a circleCi property, should call fileExists with the string '/.circleci'", done => {
      preCommitFunctions.fileExists.restore();
      sinon.stub(preCommitFunctions, "fileExists").returns(false);
      preCommitFunctions.handleDiffResult(null, mockResult, {
        preCommit: {
          maxFileSize: 2,
          circleCi: true
        }
      });
      expect(preCommitFunctions.fileExists.calledOnceWith("/.circleci")).to.be
        .true;
      expect(process.exit.called).to.be.true;
      preCommitFunctions.fileExists.restore();
      sinon.spy(preCommitFunctions, "fileExists");
      done();
    });
    it("If the config object does not contain a circleCi property, should not call fileExists with the string '/.circleci'", done => {
      preCommitFunctions.handleDiffResult(null, mockResult, {
        preCommit: {
          maxFileSize: 2
        }
      });
      expect(preCommitFunctions.fileExists.called).to.be.false;
      done();
    });
    it("If the config object contains a esLintCheck property, should call fileExists with the string '/.eslintrc'", done => {
      preCommitFunctions.handleDiffResult(null, mockResult, {
        preCommit: {
          maxFileSize: 2,
          esLintCheck: true
        }
      });
      expect(preCommitFunctions.fileExists.calledOnceWith("/.eslintrc")).to.be
        .true;
      done();
    });
    it("If the config object does not contain a esLintCheck property, should not call fileExists with the string '/.eslintrc'", done => {
      preCommitFunctions.handleDiffResult(null, mockResult, {
        preCommit: { maxFileSize: 2 }
      });
      expect(preCommitFunctions.fileExists.called).to.be.false;
      done();
    });
    it("If cypress is truthy in config, should call file Exists with the correct arg", done => {
      preCommitFunctions.handleDiffResult(null, mockResult, {
        preCommit: { maxFileSize: 2, cypress: "./cypress" }
      });
      expect(preCommitFunctions.fileExists.calledOnceWith("./cypress")).to.be
        .true;
      done();
    });
    it("If Robot is truthy in config, should call file Exists with the correct arg", done => {
      preCommitFunctions.handleDiffResult(null, mockResult, {
        preCommit: { maxFileSize: 2, robot: "./robot" }
      });
      expect(preCommitFunctions.fileExists.calledWith("./robot")).to.be.true;
      done();
    });
  });
  describe("fileExists()", () => {
    it("Should returns false if the file does not exist", () => {
      sinon.stub(fs, "existsSync").returns(false);
      expect(preCommitFunctions.fileExists("spec/pre-commit.spec.js")).to.be
        .false;
      fs.existsSync.restore();
    });
    it("Should return true if the file exists", () => {
      sinon.stub(fs, "existsSync").returns(true);
      const result = preCommitFunctions.fileExists("spec/pre-commit.spec.js");
      expect(result).to.be.true;
      fs.existsSync.restore();
    });
  });
});
