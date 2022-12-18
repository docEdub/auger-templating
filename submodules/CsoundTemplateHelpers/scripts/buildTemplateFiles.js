const fs = require("fs");
const path = require("path");
const CliArgs = require("command-line-args");
const CliUsage = require("command-line-usage");
const Handlebars = require("handlebars/dist/handlebars.min.js");
const JsonMerger = require("json-merger");


// Configure and parse command line interface arguments

// Note:
// - The `buildDir` arg is expected to be an absolute path.
// - All other path arguments are expected to be relative to the source root directory.
// - The `helper-files` arg items are expected to be given as Typescript filenames.

const cliOptions = [
    {
        name: "build-dir",
        type: String,
        description: "Should be the same as CMAKE_BINARY_DIR."
    },
    {
        name: "instruments",
        type: String,
        multiple: true,
        description: "The list of instrument .orc files to include."
    },
    {
        name: "opcodes",
        type: String,
        multiple: true,
        description: "The list of opcode .orc files to include."
    },
    {
        name: "scores",
        type: String,
        multiple: true,
        description: "The list of score .sco files to include."
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


// Load helpers

const buildOutputDir = path.join(arg.buildDir, ".output");

verbose_log(``);
verbose_log(`Constants:`);
verbose_log(`{`);
verbose_log(`  buildOutputDir = ${buildOutputDir}`);

for (let i = 0; i < arg.helperFiles.length; i++) {
    const helperTypescriptBasename = path.basename(arg.helperFiles[i]);
    const helperRelativeDir = path.dirname(arg.helperFiles[i]);
    const helperJavascriptBasename = helperTypescriptBasename.replace(".ts", ".js");
    const helperBuildFilename = path.join(buildOutputDir, helperRelativeDir, helperJavascriptBasename);
    const helperBasenameWithoutExtension = helperJavascriptBasename.replace(".js", "");
    const helperClassName =
        `${helperBasenameWithoutExtension.charAt(0).toUpperCase()}${helperBasenameWithoutExtension.slice(1)}`
    ;

    verbose_log(``);
    verbose_log(`  Helper[${i}]:`);
    verbose_log(`  {`)
    verbose_log(`    helperTypescriptBasename = ${helperTypescriptBasename}`);
    verbose_log(`    helperRelativeDir = ${helperRelativeDir}`);
    verbose_log(`    helperJavascriptBasename = ${helperJavascriptBasename}`);
    verbose_log(`    helperBuildFilename = ${helperBuildFilename}`);
    verbose_log(`    helperClassName = ${helperClassName}`);
    verbose_log(`  }`)

    require(helperBuildFilename);
    eval(`new ${helperClassName}(Handlebars)`);
}


// Merge JSON files

const json = JsonMerger.mergeFiles(arg.jsonFiles, {
    defaultArrayMergeOperation: "concat"
});
json[`Instruments`] = arg.instruments;
json[`Scores`] = arg.scores;
json[`User defined opcodes`] = arg.opcodes;
json.fileName = arg.source;

verbose_log(``);
verbose_log(`  JSON:`);
verbose_log(arg.verbose ? `  ${JSON.stringify(json, null, 2).replaceAll("\n", "\n  ")}` : "");


// Build template source

const sourceBuildDir = path.join(buildOutputDir, path.dirname(arg.source));
const sourceBasename = path.basename(arg.source);
const sourceBuildFilename = path.join(sourceBuildDir, sourceBasename);

verbose_log(``);
verbose_log(`  sourceBuildDir = ${sourceBuildDir}`);
verbose_log(`  sourceBasename = ${sourceBasename}`);
verbose_log(`  sourceBuildFilename = ${sourceBuildFilename}`);
verbose_log(`}`);

const source = fs.readFileSync(arg.source, 'ascii');
const template = Handlebars.compile(source);
const output = template(json);

verbose_log(``);
verbose_log(`Output:`);
verbose_log(`{`);
verbose_log(`  ${output.replaceAll("\n", "\n  ")}`);
verbose_log(`}`);

fs.mkdirSync(sourceBuildDir, { recursive: true });
fs.writeFileSync(sourceBuildFilename, output, 'ascii');


// Done

verbose_log(``);
verbose_log(`buildTemplateFiles.js - done`);
verbose_log(``);
