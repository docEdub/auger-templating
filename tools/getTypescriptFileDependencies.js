const fs = require("fs");
const path = require("path");
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
        name: "output-file",
        type: String,
        description: "The file to write the resulting JavaScript array to."
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
        return CliArgs(cliOptions, { camelCase: true });
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

const recursedDependencies = (absoluteFileName) => {
    const dependencies = [];
    dependencies.push(absoluteFileName);
    const file = fs.readFileSync(absoluteFileName, "utf8");
    const dependencyFileNames = Detective(file);
    for (let i = 0; i < dependencyFileNames.length; i++) {
        let dependencyFileName = dependencyFileNames[i];
        if (!path.isAbsolute(dependencyFileName)) {
            if (path.extname(dependencyFileName) === "") {
                dependencyFileName += ".ts";
            }
            dependencyFileName = path.resolve(path.dirname(absoluteFileName), dependencyFileName);
        }
        dependencies.push(...recursedDependencies(dependencyFileName));
    }
    return dependencies;
}

const dependencies = recursedDependencies(path.resolve(".", arg.helperFile));
verbose_log(dependencies);

fs.mkdirSync(path.dirname(arg.outputFile), { recursive: true });
fs.writeFileSync(arg.outputFile, `${dependencies.toString().replaceAll(",", "\n")}\n`, "ascii");
