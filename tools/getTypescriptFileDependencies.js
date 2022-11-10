const fs = require("fs");
const Detective = require("detective-typescript");
const CliArgs = require("command-line-args");
const CliUsage = require("command-line-usage");

const cliOptions = [
    {
        name: "helper-file",
        type: String,
        description: "The Handlebar TypeScript helper file to search."
    },
    {
        name: "verbose",
        alias: "v",
        type: Boolean,
        description: "Turn on debug output."
    },
    {
        name: "help",
        alias: "h",
        type: Boolean,
        description: "Print usage guide."
    }
];

const getCliArgs = () => {
    try {
        return CliArgs(cliOptions, { camelCase: true});
    }
    catch(e) {
        console.log(e.message);
        return null;
    }
}

const arg = getCliArgs()

if (!arg || arg.help) {
    const cliUsage = [
        {
            header: "Usage",
            optionList: cliOptions
        }
    ]
    console.log(CliUsage(cliUsage));
    return 0;
}

const verbose_log = (message) => {
    if (arg.verbose) {
        console.log(message);
    }
}

verbose_log(`\n`);
verbose_log("buildTemplateFiles.js ...");

verbose_log(`\n`);
verbose_log(`Arguments:`)
verbose_log(arg);

const helperFile = fs.readFileSync(arg.helperFile, "utf8");
const dependencies = Detective(helperFile);
console.log(dependencies);
