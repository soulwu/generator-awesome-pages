import yeoman from 'yeoman-generator';
import _ from 'underscore.string';

class PageGenerator extends yeoman.Base {
  constructor(...args) {
    super(...args);

    this.argument('module', {
      desc: 'Module name, e.g. crowdfunding, invite, etc.',
      type: String,
      required: true
    });

    this.argument('name', {
      desc: 'Page name, e.g. list, detail, etc.',
      type: String,
      required: true
    });

    this.option('title', {
      desc: 'Page title',
      type: String,
      alias: 't',
      defaults: '财富派'
    });

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

    this.destinationRoot('src');
    this.module = _.classify(this.module);
    this.name = _.camelcase(this.name, true);
  }

  __getDirectoryName() {
    return this.module.toLowerCase();
  }

  __getAssetName() {
    return this.name;
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
    const modulePrefix = _.map(this.module, (ch) => {
      const charCode = ch.charCodeAt(0);
      if (charCode >= 65 && charCode <= 90) {
        return ch;
      }

      return '';
    });
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
        module: this.module,
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
        module: this.module,
        component
      }
    );
  }

  _writeAsset() {
    const directory = this.__getDirectoryName();
    const asset = this.__getAssetName();

    this.fs.copyTpl(
      this.templatePath('asset/html.ejs'),
      this.destinationPath('assets/pages', directory, `${asset}.html`),
      {
        title: this.options.title
      }
    );

    this.fs.copyTpl(
      this.templatePath('asset/scss.ejs'),
      this.destinationPath('assets/pages', directory, `${asset}.scss`),
      {}
    );

    this.fs.copyTpl(
      this.templatePath('asset/js.ejs'),
      this.destinationPath('assets/pages', directory, `${asset}.js`),
      {}
    );
  }

  writing() {
    this._writeMain();
    this._writeReducer();
    this._writeAction();
    this._writeContainer();
    this._writeComponent();
    this._writeAsset();
  }
}

export default PageGenerator;
