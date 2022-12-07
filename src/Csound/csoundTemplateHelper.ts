
// Note:
// - The class name must be the same as the filename starting with an uppercase letter, without the `.ts` suffix.
global.CsoundTemplateHelper = class {
    constructor(Handlebars: any) {
        Handlebars.registerHelper(`csound_macros`, (input) => {
            let output = ``;
            if (input.data.root.log_i_trace_enabled) {
                output += `#define log_i_trace(args) #\n`;
                output += `    prints($args)\n`;
                output += `    prints("\\n")\n`;
                output += `#\n`;
            }
            output += `# define noop(a) ##`
            return new Handlebars.SafeString(output);
        });

        Handlebars.registerHelper(`log_i_trace`, (input) => {
            let output = ``;
            if (input.data.root.log_i_trace_enabled) {
                output += `prints("[trc] ${input.data.root.fileName}(${input.loc.start.line}): ")\n`;
                output += `    $log_i_trace`;
            }
            else {
                output += `$noop`;
            }
            return new Handlebars.SafeString(output);
        })
    }
}
