
import { Form } from './Types/form';
import { Widget } from './Types/widget';

// Note:
// - The class name must be the same as the filename, starting with an uppercase letter and without the `.ts` suffix.
global.CabbageTemplateHelper = class {
    constructor(Handlebars: any) {
        Handlebars.registerHelper("Cabbage", (input) => {
            let output = "";
            output += `<Cabbage>\n`;
            output += (new Form(input.data.root.form)).output();
            output += `</Cabbage>\n`;
            return new Handlebars.SafeString(output);
        });
    }
}
