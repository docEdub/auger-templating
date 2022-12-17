
import { Form } from './Cabbage/Types/form';
import { LayoutBuilder } from './Cabbage/Utility/layoutBuilder';
import { WidgetFactory } from './Cabbage/Utility/widgetFactory';

// Note:
// - The class name must be the same as the filename, starting with an uppercase letter and without the `.ts` suffix.
global.CabbageTemplateHelper = class {
    constructor(Handlebars: any) {
        Handlebars.registerHelper(`Cabbage`, (input) => {
            const widgetFactory = new WidgetFactory;
            widgetFactory.addTypes(input.data.root.uiTypes);
            const form = widgetFactory.create(input.data.root.ui) as Form;
            const layoutBuilder = new LayoutBuilder;
            layoutBuilder.build(form);
            let output = "";
            output += `<Cabbage>\n`;
            output += form.output();
            output += `</Cabbage>`;
            return new Handlebars.SafeString(output);
        });
    }
}
