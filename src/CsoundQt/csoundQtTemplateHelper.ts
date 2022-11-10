
import { Form } from "../Cabbage/Types/form";

// Note:
// - The class name must be the same as the filename starting with an uppercase letter, without the `.ts` suffix.
global.CsoundQtTemplateHelper = class {
    constructor(Handlebars: any) {
        Handlebars.registerHelper("CsoundQt", (input, options) => {
            let output = "";
            output += `<CsoundQt>\n`;
            output += (new Form(input.data.root.form)).output();
            output += `</CsoundQt>\n`;
            return new Handlebars.SafeString(output);
        });
    }
}
