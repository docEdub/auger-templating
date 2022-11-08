const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars/dist/handlebars.min.js");

let argStartIndex = 2;
const buildDir = process.argv[argStartIndex++];
const helperFilename = process.argv[argStartIndex++];
const jsonFilename = process.argv[argStartIndex++];
const sourceFilename = process.argv[argStartIndex++];
console.log(`buildDir = ${buildDir}`);
console.log(`helper = ${helperFilename}`);
console.log(`json = ${jsonFilename}`);
console.log(`source = ${sourceFilename}`);

require(path.join(buildDir, ".root", "src", "Cabbage", "cabbageTemplateHelper.js"));
new CabbageTemplateHelper(Handlebars);

const source = fs.readFileSync(sourceFilename, 'ascii');
const template = Handlebars.compile(source);

const jsonString = fs.readFileSync(jsonFilename, 'ascii');
const output = template(JSON.parse(jsonString));
console.log(output);

let outputDir = path.dirname(sourceFilename);
fs.mkdirSync(path.join(buildDir, ".root", outputDir), { recursive: true });
fs.writeFileSync(path.join(buildDir, ".root", sourceFilename), output, 'ascii');
