const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars/dist/handlebars.min.js");
require("../.build/cabbageHandlebars.js");

new CabbageHandlebars(Handlebars);

const argStartIndex = 2
const csdFileName = process.argv[argStartIndex]
const templateFileName = process.argv[argStartIndex + 1]
console.log(`csd = ${csdFileName}, template = ${templateFileName}`)

const rootDir = ".";
const csd = fs.readFileSync(path.join(rootDir, "csd", csdFileName), 'ascii');
const csdJsonString = fs.readFileSync(path.join(rootDir, "csd", templateFileName), 'ascii');
const csdJson = JSON.parse(csdJsonString);

const template = Handlebars.compile(csd);
const output = template(csdJson);

console.log(output);
fs.writeFileSync(path.join(".build", "test.csd"), output, 'ascii');
