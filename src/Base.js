import yeoman from 'yeoman-generator';
import _ from 'underscore.string';

class Base extends yeoman.Base {
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
      }},
      {type: 'input', name: 'page', message: '页面名', validate: (input) => {
        if (/^[a-z][a-z0-9]*$/i.test(input)) {
          return true;
        }

        return '页面名只能由英文字母和数字构成，而且必须以英文字母开头';
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
    this.moduleName = _.classify(answers.module);
    this.name = _.camelcase(answers.page, true);
    this.title = answers.title;
  }

  __getDirectoryName() {
    return this.moduleName.toLowerCase();
  }

  __getAssetName() {
    return this.name;
  }
}

export default Base;
