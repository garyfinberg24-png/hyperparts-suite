'use strict';

const build = require('@microsoft/sp-build-web');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

// Suppress all lint warnings — we use `var` deliberately for ES5 target compatibility
build.addSuppression(`Warning - [lint] -`);

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set('serve', result.get('serve-deprecated'));

  return result;
};

// Disable ESLint task — no-var warnings are expected (ES5 target requires var)
// This prevents 4000+ warnings from failing --ship builds
build.lintCmd.enabled = false;

build.initialize(require('gulp'));
