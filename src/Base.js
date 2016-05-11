import yeoman from 'yeoman-generator';
import _ from 'underscore.string';

class Base extends yeoman.Base {
  constructor(...args) {
    super(...args);

    this.argument('module', {
      desc: 'Module name, e.g. crowdfunding, invite, etc.',
      type: String,
      required: true
    });

    this.argument('page', {
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

    this.destinationRoot('src');
    this.moduleName = _.classify(this.module);
    this.name = _.camelcase(this.page, true);
  }

  __getDirectoryName() {
    return this.moduleName.toLowerCase();
  }

  __getAssetName() {
    return this.name;
  }
}

export default Base;
