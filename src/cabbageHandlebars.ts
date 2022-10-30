
global.CabbageHandlebars = class {
    constructor(Handlebars: any) {
        console.log("CabbageHandlebars c'tor ...");
        Handlebars.registerHelper("Cabbage", (input, options) => {
            console.log("Cabbage ...");
            const form = input.data.root.form;
            let output = `<Cabbage>\n`;
            output += `form`;
            output += ` size(${form.width}, ${form.height})`
            output += ` caption("${form.caption}")`;
            output += ` pluginId("${form.pluginId}")`;
            output += `\n`;
            output += `</Cabbage>`;
            return new Handlebars.SafeString(output);
        });
    }
}
