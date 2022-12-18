const fs = require(`fs`);

// Note:
// - The class name must be the same as the filename starting with an uppercase letter, without the `.ts` suffix.
global.CsoundTemplateHelper = class {
    constructor(Handlebars: any) {
        const logLevels = [
            { name: `Trace`, abbreviation: `trc` },
            { name: `Debug`, abbreviation: `dbg` },
            { name: `Info`, abbreviation: `inf` },
            { name: `Warning`, abbreviation: `wrn` },
            { name: `Error`, abbreviation: `err` }
        ]

        const registerHelper = (name, callback) => {
            Handlebars.registerHelper(name, (arg1, arg2, arg3) => {
                return new Handlebars.SafeString(callback(arg1, arg2, arg3));
            });
        }

        const buildOutputDir = () => {
            for (let i = 0; i < process.argv.length - 1; i++) {
                if (process.argv[i] === `--build-dir`) {
                    return `${process.argv[i + 1]}/.output`;
                }
            }
            throw new Error(`Unable to find build root directory.`);
        }

        const logMacros = (input) => {
            let output = ``;
            let enableLogI = false;
            let enableLogK = false;
            for (let i = 0; i < logLevels.length; i++) {
                const logLevel = logLevels[i];
                if (input.data.root[`Enable Log${logLevel.name}_i`]) {
                    enableLogI = true;
                }
                if (input.data.root[`Enable Log${logLevel.name}_k`]) {
                    enableLogK = true;
                }
                if (enableLogI && enableLogK) {
                    break;
                }
            }
            if (enableLogI) {
                output += `#define log_i(args) #\n`;
                output += `    prints($args)\n`;
                output += `    prints("\\n")\n`;
                output += `#\n`;
            }
            if (enableLogK) {
                if (enableLogI) {
                    output += `\n`;
                }
                output += `#define log_k(args) #\n`;
                output += `    printsk($args)\n`;
                output += `    printsk("\\n")\n`;
                output += `#\n`;
                if (enableLogI) {
                    output += `\n`;
                }
            }
            return output;
        };

        const globalVariables = () => {
            let output = ``;
            output += `gki init 0\n`
            output += `\n`;
            return output;
        }

        const opcodes = (input) => {
            let output = ``;
            const opcodes = input.data.root[`User defined opcodes`];
            for (let i = 0; i < opcodes.length; i++) {
                output += `#include "${opcodes[i]}"\n`
            }
            output += `\n`;
            return output;
        }

        const instruments = (input) => {
            let output = ``;
            const instruments = input.data.root[`Instruments`];
            for (let i = 0; i < instruments.length; i++) {
                output += `#include "${instruments[i]}"\n`
            }
            return output;
        }

        const scores = (input) => {
            let output = ``;
            const scores = input.data.root[`Scores`];
            for (let i = 0; i < scores.length; i++) {
                output += `#include "${scores[i]}"\n`
            }
            return output;
        }

        const variableNameFromFileName = (fileName: string) => {
            fileName = fileName.replace(`/`, `_`);
            fileName = fileName.replace(`.`, `_`);
            return fileName;
        }

        registerHelper(`CsdOptionsCore`, (input) => {
            let output = ``;
            output += `--env:INCDIR=${buildOutputDir()}`
            return output;
        });

        registerHelper(`CsdOrcGlobalCore`, (input) => {
            let output = ``;
            output += `0dbfs = 1\n`;
            output += `\n`;
            output += logMacros(input);
            output += globalVariables();
            output += opcodes(input);
            output += instruments(input);
            return output;
        });

        registerHelper(`CsdScoGlobalCore`, (input) => {
            let output = ``;
            output += scores(input);
            return output;
        });

        registerHelper(`includeGuardStart`, (input) => {
            let fileName = variableNameFromFileName(input.data.root.fileName);
            let output = ``;
            output += `#ifndef ${fileName}\n`;
            output += `#define ${fileName} #1#`;
            return output;
        });

        registerHelper(`includeGuardEnd`, (input) => {
            let output = ``;
            output += `#endif`;
            return output;
        });

        registerHelper(`include`, (fileName) => {
            return `#include "${fileName}"`;
        })

        // Add log level i helpers.
        for (let i = 0; i < logLevels.length; i++) {
            const logLevel = logLevels[i];
            registerHelper(`Log${logLevel.name}_i`, (input) => {
                const disabler = input.data.root[`Enable Log${logLevel.name}_i`] ? `` : `; `;
                let output = ``;
                output += `${disabler}prints("%s  i.%d  ${input.data.root.fileName}(${input.loc.start.line})  [${logLevel.abbreviation}]:  ", timeString_i(), i(gki))\n`;
                output += `    ${disabler}$log_i`;
                return output;
            });
        }

        // Add log level k helpers.
        for (let i = 0; i < logLevels.length; i++) {
            const logLevel = logLevels[i];
            registerHelper(`Log${logLevel.name}_k`, (input) => {
                const disabler = input.data.root[`Enable Log${logLevel.name}_k`] ? `` : `; `;
                let output = ``;
                output += `${disabler}printsk("%s  k.%d  ${input.data.root.fileName}(${input.loc.start.line})  [${logLevel.abbreviation}]:  ", timeString_k(), gki - 1)\n`;
                output += `    ${disabler}$log_k`;
                return output;
            });
        }
    }
}
