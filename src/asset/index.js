import Base from '../Base';

class AssetGenerator extends Base {
  initializing() {
    super.initializing();

    this._addQuestions(
      {type: 'confirm', name: 'js', message: '是否需要使用js', default: true}
    );
  }

  prompting() {
    return super.prompting();
  }

  _processAnswers(answers) {
    super._processAnswers(answers);

    this.js = answers.js;
  }

  _writeAsset() {
    const directory = this.__getDirectoryName();
    const asset = this.__getAssetName();

    this.fs.copyTpl(
      this.templatePath('html.ejs'),
      this.destinationPath('assets/pages', directory, `${asset}.html`),
      {
        title: this.title
      }
    );

    this.fs.copyTpl(
      this.templatePath('scss.ejs'),
      this.destinationPath('assets/pages', directory, `${asset}.scss`),
      {}
    );

    if (this.js) {
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
