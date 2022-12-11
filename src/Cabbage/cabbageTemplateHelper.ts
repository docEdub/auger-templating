
import { Form } from './Types/form';
import { WidgetFactory } from './Utility/widgetFactory';

// Note:
// - The class name must be the same as the filename, starting with an uppercase letter and without the `.ts` suffix.
global.CabbageTemplateHelper = class {
    constructor(Handlebars: any) {
        Handlebars.registerHelper("Cabbage", (input) => {
            const widgetFactory = new WidgetFactory;
            const form = widgetFactory.create(input.data.root);
            let output = "";
            output += `<Cabbage>\n`;
            output += form.output();
            output += `</Cabbage>\n`;
            return new Handlebars.SafeString(output);
        });
    }
}
