# Commit Hooks

[![CircleCI](https://circleci.com/gh/lukebrobbs/commit-hooks.svg?style=svg)](https://circleci.com/gh/lukebrobbs/commit-hooks) &nbsp;&nbsp;&nbsp;[![codecov](https://codecov.io/gh/lukebrobbs/commit-hooks/branch/master/graph/badge.svg)](https://codecov.io/gh/lukebrobbs/commit-hooks)&nbsp;&nbsp;&nbsp;[![npmVersion](https://img.shields.io/npm/v/ddc-commit-hooks.svg)](https://www.npmjs.com/package/ddc-commit-hooks)

DDC-Commit-Hooks is designed to allow the implementation of pre-defined tasks to be implemented during git hooks. These tasks are intended to maximise code quality.

---

## Install

```sh
npm install ddc-commit-hooks --save-dev
```

## Run

To run the package, add the following to your npm scripts:

```sh
ddc-commit
```

this can be followed by the following options :

`-preCommit` - To run all user defined pre commit hooks

`-commitMsg` - To run all user defined commit-message hooks

It is recomended to use this package with [Husky](https://github.com/typicode/husky). Configuration would look as follows:

```js
// .huskyrc
{
  "hooks": {
    "pre-commit": "npm test && ddc-commit -preCommit",
    "commit-msg": "ssc-commit -commitMsg"
  }
}
```

## Configuration

To configure Hooks, create a `.commithooksrc` file.

```js
// .commithooksrc
{
  "preCommit": {
    "maxFileSize": 2,
    "esLintCheck": true
  }
}
```

It is also possible to create a `commithooks.json` to achieve the same result (Note - content in the `.commithooksrc` file will override `commithooks.json`)

---

## Options

The following options are available in v1.0.0 :

### preCommit

Any of these properties will work inside a `preCommit` key:

| Property        | Type      | Default | Description                                        |
| --------------- | --------- | ------- | -------------------------------------------------- |
| **gitlabCi**    | `Boolean` | `false` | Checks for the presence of a `.gitlab-ci.yml` file |
| **circleCi**    | `Boolean` | `false` | Checks for the presence of a `.circleci` directory |
| **esLintCheck** | `Boolean` | `false` | Checks for the presence of a `.eslintrc` file      |
| **maxFileSize** | `Number`  | `2`     | Max size in mb allowed for any single file         |
| **cypress**     | `String`  | `""`    | Directory of cypress tests if applicable           |
| **robot**       | `String`  | `""`    | Directory of Robot Framework tests if applicable   |

### commitMsg

Any of these properties will work inside a `commitMsg` key, and will be run on the users commit message:

| Property            | Type     | Default | Description                                     |
| ------------------- | -------- | ------- | ----------------------------------------------- |
| **_glob_**          | `Regex`  | `". *"` | Regex patter to check for in the commit title   |
| **_maxLineLength_** | `Number` | `79`    | Set max line length allowed in a commit message |
| **_titleLength_**   | `Number` | `25`    | Sets max length for a commit title              |
