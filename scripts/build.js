const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars/dist/handlebars.min.js");
require("../.build/cabbageHandlebars.js");

const cabbageHandlebars = new CabbageHandlebars(Handlebars);
console.log(cabbageHandlebars);

const rootDir = ".";
const csd = fs.readFileSync(path.join(rootDir, "csd", "test.csd"), 'ascii');
const csdJsonString = fs.readFileSync(path.join(rootDir, "csd", "test.csd.json"), 'ascii');
const csdJson = JSON.parse(csdJsonString);

const template = Handlebars.compile(csd);
const output = template(csdJson);

console.log(output);
fs.writeFileSync(path.join(".build", "test.csd"), output, 'ascii');
