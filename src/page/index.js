import Base from '../Base';
import _ from 'underscore.string';

class PageGenerator extends Base {
  initializing() {
    super.initializing();

    this._addQuestions([
      {type: 'confirm', name: 'reducer', message: '是否需要生成reducer', default: true},
      {type: 'confirm', name: 'stateful', message: '组件是否有状态', default: false}
    ]);
  }

  prompting() {
    return super.prompting();
  }

  _processAnswers(answers) {
    super._processAnswers(answers);

    this.reducer = answers.reducer;
    this.stateful = answers.stateful;
  }

  __getContainerName() {
    return `${this.__getComponentName()}Page`;
  }

  __getComponentName() {
    return _.capitalize(this.name);
  }

  __getReducerName() {
    return this.name;
  }

  __getActionName() {
    return `load${_.capitalize(this.name)}`;
  }

  __getActionType() {
    let modulePrefix = _(this.moduleName).classify().map((ch) => {
      const charCode = ch.charCodeAt(0);
      if (charCode >= 65 && charCode <= 90) {
        return ch;
      }

      return '';
    }).value();
    if (modulePrefix.length <= 1) {
      modulePrefix = this.moduleName.toUpperCase();
    }
    const actionPrefix = `${modulePrefix}_${_.underscored(this.name).toUpperCase()}`;

    return {
      REQUEST: `${actionPrefix}_REQUEST`,
      SUCCESS: `${actionPrefix}_SUCCESS`,
      FAILURE: `${actionPrefix}_FAILURE`
    };
  }

  _writeMain() {
    const directory = this.__getDirectoryName();

    this.fs.copyTpl(
      this.templatePath('main.ejs'),
      this.destinationPath('main', directory, `${this.name}.js`),
      {
        title: this.title,
        directory,
        reducer: this.reducer ? this.__getReducerName() : '',
        container: this.__getContainerName()
      }
    );
  }

  _writeAction() {
    const directory = this.__getDirectoryName();
    const action = this.__getActionName();
    const {REQUEST, SUCCESS, FAILURE} = this.__getActionType();

    this.fs.copyTpl(
      this.templatePath('action.ejs'),
      this.destinationPath('action', directory, `${action}.js`),
      {
        action,
        REQUEST,
        SUCCESS,
        FAILURE
      }
    );
  }

  _writeReducer() {
    const directory = this.__getDirectoryName();
    const reducer = this.__getReducerName();
    const action = this.__getActionName();
    const {REQUEST, SUCCESS, FAILURE} = this.__getActionType();

    this.fs.copyTpl(
      this.templatePath('reducer.ejs'),
      this.destinationPath('reducer', directory, `${reducer}.js`),
      {
        directory,
        reducer,
        action,
        REQUEST,
        SUCCESS,
        FAILURE
      }
    );
  }

  _writeContainer() {
    const directory = this.__getDirectoryName();
    const container = this.__getContainerName();
    const action = this.__getActionName();
    const component = this.__getComponentName();
    const asset = this.__getAssetName();

    this.fs.copyTpl(
      this.templatePath('container.ejs'),
      this.destinationPath('container', directory, `${container}.js`),
      {
        moduleName: this.moduleName,
        action,
        directory,
        component,
        asset,
        container
      }
    );
  }

  _writeComponent() {
    const directory = this.__getDirectoryName();
    const component = this.__getComponentName();
    const asset = this.__getAssetName();

    this.fs.copyTpl(
      this.templatePath(this.stateful ? 'component.ejs' : 'component-stateless.ejs'),
      this.destinationPath('component', directory, `${component}.js`),
      {
        moduleName: this.moduleName,
        component,
        directory,
        asset
      }
    );
  }

  writing() {
    this._writeMain();
    this._writeAction();
    this.reducer && this._writeReducer();
    this._writeContainer();
    this._writeComponent();
  }
}

export default PageGenerator;
