import Base from '../Base';
import _ from 'underscore.string';

class AssetGenerator extends Base {
  constructor(...args) {
    super(...args);

    this.option('no-js', {
      desc: 'No asset js file',
      type: Boolean,
      defaults: false
    });
  }

  _writeAsset() {
    const directory = this.__getDirectoryName();
    const asset = this.__getAssetName();

    this.fs.copyTpl(
      this.templatePath('html.ejs'),
      this.destinationPath('assets/pages', directory, `${asset}.html`),
      {
        title: this.options.title
      }
    );

    this.fs.copyTpl(
      this.templatePath('scss.ejs'),
      this.destinationPath('assets/pages', directory, `${asset}.scss`),
      {}
    );

    if (!this.options['no-js']) {
      this.fs.copyTpl(
        this.templatePath('js.ejs'),
        this.destinationPath('assets/pages', directory, `${asset}.js`),
        {}
      );
    }
  }

  writing() {
    this._writeAsset();
  }
}

export default AssetGenerator;
