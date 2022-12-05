
// Note:
// - The class name must be the same as the filename starting with an uppercase letter, without the `.ts` suffix.
global.CsoundTemplateHelper = class {
    constructor(Handlebars: any) {
        Handlebars.registerHelper(`csound_macros`, (input) => {
            let output = ``;
            if (input.data.root.log_i_trace_enabled) {
                output += `#define log_i_trace(args) #\n    prints($args)\n    prints("\\n")\n#\n`;
            }
            output += `# define noop(a) ##`
            return new Handlebars.SafeString(output);
        });

        Handlebars.registerHelper(`log_i_trace`, (input) => {
            let output = ``;
            if (input.data.root.log_i_trace_enabled) {
                output += `prints("[trc] __FILE__:__LINE__")\n`;
                output += `    $log_i_trace`;
            }
            else {
                output += `$noop`;
            }
            return new Handlebars.SafeString(output);
        })
    }
}
