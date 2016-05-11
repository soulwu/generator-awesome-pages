import yeoman from 'yeoman-generator';
import _ from 'underscore.string';

class WidgetGenerator extends yeoman.Base {
  constructor(...args) {
    super(...args);

    this.argument('widget', {
      desc: 'Widget name, e.g. list, progressBar, etc.',
      type: String,
      required: true
    });

    this.destinationRoot('src');
    this.name = _.classify(this.widget);
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('widget.ejs'),
      this.destinationPath('component/widget', `${this.name}.js`),
      {
        widget: this.name
      }
    );
  }
}

export default WidgetGenerator;
