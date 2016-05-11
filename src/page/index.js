import Base from '../Base';
import _ from 'underscore.string';

class PageGenerator extends Base {
  constructor(...args) {
    super(...args);

    this.option('no-reducer', {
      desc: 'No individual root reducer',
      type: Boolean,
      defaults: false
    });

    this.option('no-action', {
      desc: 'No startup load action',
      type: Boolean,
      defaults: false
    });
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
        title: this.options.title,
        directory,
        reducer: this.options['no-reducer'] ? '' : this.__getReducerName(),
        container: this.__getContainerName()
      }
    );
  }

  _writeReducer() {
    if (this.options['no-reducer']) {
      return;
    }

    const directory = this.__getDirectoryName();
    const reducer = this.__getReducerName();
    const {REQUEST, SUCCESS, FAILURE} = this.__getActionType();

    this.fs.copyTpl(
      this.templatePath('reducer.ejs'),
      this.destinationPath('reducer', directory, `${reducer}.js`),
      {
        directory,
        reducer,
        action: this.options['no-action'] ? '' : this.__getActionName(),
        REQUEST,
        SUCCESS,
        FAILURE
      }
    );
  }

  _writeAction() {
    if (this.options['no-action']) {
      return;
    }

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

    this.fs.copyTpl(
      this.templatePath('component.ejs'),
      this.destinationPath('component', directory, `${component}.js`),
      {
        moduleName: this.moduleName,
        component
      }
    );
  }

  writing() {
    this._writeMain();
    this._writeReducer();
    this._writeAction();
    this._writeContainer();
    this._writeComponent();
  }
}

export default PageGenerator;
