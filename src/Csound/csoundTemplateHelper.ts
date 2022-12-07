
// Note:
// - The class name must be the same as the filename starting with an uppercase letter, without the `.ts` suffix.
global.CsoundTemplateHelper = class {
    constructor(Handlebars: any) {
        const logLevels = [
            { name: `trace`, abbreviation: `trc` },
            { name: `debug`, abbreviation: `dbg` },
            { name: `info`, abbreviation: `inf` },
            { name: `warning`, abbreviation: `wrn` },
            { name: `error`, abbreviation: `err` }
        ]

        Handlebars.registerHelper(`csound_macros`, (input) => {
            let output = ``;
            for (let i = 0; i < logLevels.length; i++) {
                const logLevel = logLevels[i];
                if (input.data.root[`log_i_${logLevel.name}_enabled`]) {
                    output += `#define log_i_${logLevel.name}(args) #\n`;
                    output += `    prints($args)\n`;
                    output += `    prints("\\n")\n`;
                    output += `#\n`;
                }
            }
            return new Handlebars.SafeString(output);
        });

        for (let i = 0; i < logLevels.length; i++) {
            const logLevel = logLevels[i];
            Handlebars.registerHelper(`log_i_${logLevel.name}`, (input) => {
                const disabler = input.data.root[`log_i_${logLevel.name}_enabled`] ? `` : `; `;
                let output = ``;
                output += `${disabler}prints("[${logLevel.abbreviation}] ${input.data.root.fileName}(${input.loc.start.line}): ")\n`;
                output += `    ${disabler}$log_i_${logLevel.name}`;
                return new Handlebars.SafeString(output);
            })
        }
    }
}
