import Handlebars from "handlebars/dist/handlebars.min.js"

export class CsoundHandlebarsHelpers {
    constructor() {
        Handlebars.registerHelper("wrapped", (input) => {
            return new Handlebars.SafeString("<" + input + ">");
        });
    }
}
