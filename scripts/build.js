const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars/dist/handlebars.min.js");
require("../.build/cabbageHandlebars.js");

new CabbageHandlebars(Handlebars);

const argStartIndex = 1
const templateFileName = process.argv[argStartIndex + 1]
const templateDataFileName = process.argv[argStartIndex + 2]
console.log(`csd = ${templateFileName}, template = ${templateFileName}`)

const csd = fs.readFileSync(templateFileName, 'ascii');
const template = Handlebars.compile(csd);

const csdJsonString = fs.readFileSync(templateDataFileName, 'ascii');
const output = template(JSON.parse(csdJsonString));

console.log(output);
fs.writeFileSync(path.join(".build", "test.csd"), output, 'ascii');
