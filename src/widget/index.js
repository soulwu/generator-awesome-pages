import BaseGenerator from '../Base';
import _ from 'underscore.string';

class WidgetGenerator extends BaseGenerator {
  initializing() {
    super.initializing();

    this._addQuestions([
      {type: 'input', name: 'widget', message: '组件名', validate: (input) => {
        if (/^[a-z][a-z0-9]*$/i.test(input)) {
          return true;
        }

        return '组件名只能由英文字母和数字构成，而且必须以英文字母开头';
      }, cb: (widget) => {
        this.name = _.classify(widget);
      }},
      {type: 'confirm', name: 'stateful', message: '组件是否有状态', default: false}
    ], true);
  }

  prompting() {
    return super.prompting();
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath(this.stateful ? 'widget.ejs' : 'widget-stateless.ejs'),
      this.destinationPath('component/widget', `${this.name}.js`),
      {
        widget: this.name
      }
    );
  }
}

export default WidgetGenerator;
