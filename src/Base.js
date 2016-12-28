import Generator from 'yeoman-generator';
import _ from 'underscore.string';
import find from 'lodash/find';
import isFunction from 'lodash/isFunction';
import isUndefined from 'lodash/isUndefined';

class BaseGenerator extends Generator {
  constructor(...args) {
    super(...args);

    this.questions = [];
    this.destinationRoot('src');
  }

  initializing() {
    this._addQuestions([
      {type: 'input', name: 'module', message: '模块名', validate: (input) => {
        if (/^[a-z][a-z0-9]*$/i.test(input)) {
          return true;
        }

        return '模块名只能由英文字母和数字构成，而且必须以英文字母开头';
      }, cb: (module) => {
        this.moduleName = _.classify(module);
      }},
      {type: 'input', name: 'page', message: '页面名', validate: (input) => {
        if (/^[a-z][a-z0-9]*$/i.test(input)) {
          return true;
        }

        return '页面名只能由英文字母和数字构成，而且必须以英文字母开头';
      }, cb: (page) => {
        this.name = _.camelcase(page, true);
      }},
      {type: 'input', name: 'title', message: '页面标题', default: '财富派'}
    ]);
  }

  _addQuestions(questions, clear = false) {
    if (clear) {
      this.questions = questions;
    } else {
      this.questions = this.questions.concat(questions);
    }
  }

  prompting() {
    return this.prompt(this.questions).then(this._processAnswers.bind(this));
  }

  _processAnswers(answers) {
    Object.keys(answers).forEach((name) => {
      const {cb} = find(this.questions, {name});
      if (isFunction(cb)) {
        cb(answers[name]);
      } else if (isUndefined(this[name])) {
        this[name] = answers[name];
      } else {
        this.log(`Prompt ${name} with value ${answers[name]} does not have a callback and can not be assign to instance directly.`);
      }
    });
  }

  __getDirectoryName() {
    return this.moduleName.toLowerCase();
  }

  __getAssetName() {
    return this.name;
  }
}

export default BaseGenerator;
