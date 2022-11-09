const fs = require("fs");
const path = require("path");
const CliArgs = require("command-line-args");
const CliUsage = require("command-line-usage");
const Handlebars = require("handlebars/dist/handlebars.min.js");

// Note:
// - The `buildDir` arg is expected to be an absolute path.
// - All other path arguments are expected to be relative to the root directory.
// - The `helper-files` arg is expected to be given as the Typescript source filenames.

const cliOptions = [
    {
        name: "build-dir",
        type: String,
        description: "Should be the same as CMAKE_BINARY_DIR."
    },
    {
        name: "helper-files",
        type: String,
        multiple: true,
        description: "The list of Handlebar helper files to require and instantiate."
    },
    {
        name: "json-files",
        type: String,
        multiple: true,
        description: "The list of JSON files used to expand the template source."
    },
    {
        name: "source",
        type: String,
        description: "The template source file to build."
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

const isVerbose = arg.verbose;
if (isVerbose) {
    console.log("\nbuildTemplateFiles.js ...");
}

if (isVerbose) {
    console.log(`\nArguments:`)
    console.log(arg);
}


// Load helper

const buildRootDir = path.join(arg.buildDir, ".root");
const helperTypescriptBasename = path.basename(arg.helperFiles[0]);
const helperRelativeDir = path.dirname(arg.helperFiles[0]);
const helperJavascriptBasename = helperTypescriptBasename.replace(".ts", ".js");
const helperBuildFilename = path.join(buildRootDir, helperRelativeDir, helperJavascriptBasename);
const helperBasenameWithoutExtension = helperJavascriptBasename.replace(".js", "");
const helperClassName =
    `${helperBasenameWithoutExtension.charAt(0).toUpperCase()}${helperBasenameWithoutExtension.slice(1)}`
;

if (isVerbose) {
    console.log(`\nConstants:`);
    console.log(`{`);
    console.log(`  buildRootDir = ${buildRootDir}`);
    console.log(`  helperTypescriptBasename = ${helperTypescriptBasename}`);
    console.log(`  helperRelativeDir = ${helperRelativeDir}`);
    console.log(`  helperJavascriptBasename = ${helperJavascriptBasename}`);
    console.log(`  helperBuildFilename = ${helperBuildFilename}`);
    console.log(`  helperClassName = ${helperClassName}`);
}

require(helperBuildFilename);
eval(`new ${helperClassName}(Handlebars)`);


// Build template source

const sourceBuildDir = path.join(buildRootDir, path.dirname(arg.source));
const sourceBasename = path.basename(arg.source);
const sourceBuildFilename = path.join(sourceBuildDir, sourceBasename);

if (isVerbose) {
    console.log(`  sourceBuildDir = ${sourceBuildDir}`);
    console.log(`  sourceBasename = ${sourceBasename}`);
    console.log(`  sourceBuildFilename = ${sourceBuildFilename}`);
    console.log(`}`);
}

const source = fs.readFileSync(arg.source, 'ascii');
const template = Handlebars.compile(source);

const jsonString = fs.readFileSync(arg.jsonFiles[0], 'ascii');
const output = template(JSON.parse(jsonString));

if (isVerbose) {
    console.log(`\nOutput:`);
    console.log(`{`);
    console.log(`  ${output.replaceAll("\n", "\n  ")}`);
    console.log(`}`);
}

fs.mkdirSync(sourceBuildDir, { recursive: true });
fs.writeFileSync(sourceBuildFilename, output, 'ascii');


if (isVerbose) {
    console.log(`\nbuildTemplateFiles.js - done\n`);
}
