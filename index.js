'use strict';

const quickTemp = require('quick-temp');
const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');

module.exports = {
  name: 'ember-strict-warnings',
  included(app) {
    this._super.included.apply(this, arguments);
    this._strictWarningsConfig = buildConfig(app.options.strictWarnings, app.env);
  },
  treeForApp() {
    if (!this._strictWarningsConfig) {
      return this._super.apply(this, arguments);
    } else {
      quickTemp.makeOrRemake(this, '_strictWarningsTree');
      mkdirp.sync(path.join(this._strictWarningsTree, 'initializers'));
      fs.writeFileSync(path.join(this._strictWarningsTree, 'initializers', 'ember-strict-warnings.js'), `
import { registerWarnHandler } from '@ember/debug';
let strictWarnings = ${JSON.stringify(this._strictWarningsConfig)};
registerWarnHandler((message, options, next) => {
  if (strictWarnings.indexOf('ember-htmlbars.style-xss-warning') !== -1) {
    throw new Error(message);
  }
  if (strictWarnings.indexOf('*') !== -1) {
    throw new Error(message);
  }
  next(message, options);
});

export default {
  initialize: function() {}
};

`, 'utf8');
      return this._super(this._strictWarningsTree);
    }
  }
};

function buildConfig(allConfig, env) {
  let output;
  for (let warningId in allConfig) {
    let environments = allConfig[warningId];
    if (!Array.isArray(environments)) {
      environments = [environments];
    }
    if (environments.includes(env)) {
      if (!output) {
        output = [];
      }
      output.push(warningId);
    }
  }
  return output;
}
