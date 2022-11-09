const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars/dist/handlebars.min.js");

const isVerbose = process.argv.indexOf("--verbose") != -1 || process.argv.indexOf("-v") != -1;

// Note:
// - The `buildDir` arg is expected to be an absolute path.
// - All other path arguments are expected to be relative to the root directory.
// - The `helperFilename` arg is expected to be given as the Typescript source filename.

let argStartIndex = 2;
const buildDir = process.argv[argStartIndex++];
const helperFilename = process.argv[argStartIndex++];
const jsonFilename = process.argv[argStartIndex++];
const sourceFilename = process.argv[argStartIndex++];

if (isVerbose) {
    console.log(`buildDir = ${buildDir}`);
    console.log(`helper = ${helperFilename}`);
    console.log(`json = ${jsonFilename}`);
    console.log(`source = ${sourceFilename}`);
}


// Load helper

const buildRootDir = path.join(buildDir, ".root");
const helperTypescriptBasename = path.basename(helperFilename);
const helperRelativeDir = path.dirname(helperFilename);
const helperJavascriptBasename = helperTypescriptBasename.replace(".ts", ".js");
const helperBuildFilename = path.join(buildRootDir, helperRelativeDir, helperJavascriptBasename);
const helperBasenameWithoutExtension = helperJavascriptBasename.replace(".js", "");
const helperClassName =
    `${helperBasenameWithoutExtension.charAt(0).toUpperCase()}${helperBasenameWithoutExtension.slice(1)}`
;

if (isVerbose) {
    console.log(`buildRootDir = ${buildRootDir}`);
    console.log(`helperTypescriptBasename = ${helperTypescriptBasename}`);
    console.log(`helperRelativeDir = ${helperRelativeDir}`);
    console.log(`helperJavascriptBasename = ${helperJavascriptBasename}`);
    console.log(`helperBuildFilename = ${helperBuildFilename}`);
    console.log(`helperClassName = ${helperClassName}`);
}

require(helperBuildFilename);
eval(`new ${helperClassName}(Handlebars)`);


// Build template source

const sourceBuildDir = path.join(buildRootDir, path.dirname(sourceFilename));
const sourceBasename = path.basename(sourceFilename);
const sourceBuildFilename = path.join(sourceBuildDir, sourceBasename);

if (isVerbose) {
    console.log(`sourceBuildDir = ${sourceBuildDir}`);
    console.log(`sourceBasename = ${sourceBasename}`);
    console.log(`sourceBuildFilename = ${sourceBuildFilename}`);
}

const source = fs.readFileSync(sourceFilename, 'ascii');
const template = Handlebars.compile(source);

const jsonString = fs.readFileSync(jsonFilename, 'ascii');
const output = template(JSON.parse(jsonString));

if (isVerbose) {
    console.log(output);
}

fs.mkdirSync(sourceBuildDir, { recursive: true });
fs.writeFileSync(sourceBuildFilename, output, 'ascii');
