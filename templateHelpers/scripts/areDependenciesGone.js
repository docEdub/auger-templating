const fs = require("fs");
const CliArgs = require("command-line-args");
const CliUsage = require("command-line-usage");

// Exits with code 0 if all dependencies listed in given dependency .tmp file exist; otherwise exits with code 1.

const cliOptions = [
    {
        name: "dependency-file",
        type: String,
        description: "The dependency .tmp file to search in for missing files."
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

const verbose_log = (...args) => {
    if (arg.verbose) {
        console.log(...args);
    }
}

verbose_log(`\n`);
verbose_log("isDependencyGone.js ...");

verbose_log(`\n`);
verbose_log(`Arguments:`)
verbose_log(arg);

const fileNames = fs.readFileSync(arg.dependencyFile, `ascii`).trimEnd().split(`\n`);
verbose_log(`fileNames =`, fileNames);

let gone = false;

for (let i = 0; i < fileNames.length; i++) {
    if (!fs.existsSync(fileNames[i])) {
        console.log(`Dependency ${fileNames[i]} is gone`);
        gone = true;
    }
}

if (gone) {
    process.exit(1);
}
