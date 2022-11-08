
import { Form } from "./Types/form";

global.CabbageTemplateHelper = class {
    constructor(Handlebars: any) {
        Handlebars.registerHelper("Cabbage", (input, options) => {
            let output = "";
            output += `<Cabbage>\n`;
            output += (new Form(input.data.root.form)).output();
            output += `</Cabbage>`;
            return new Handlebars.SafeString(output);
        });
    }
}
