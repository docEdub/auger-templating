import Handlebars from "handlebars/dist/handlebars.min.js"

import { CsoundHandlebarsHelpers } from "./csoundHandlebarsHelpers"

console.log("Hello csound.ts!");

new CsoundHandlebarsHelpers;

const template = Handlebars.compile("foo is {{wrapped foo}}");
const output = template({ foo: "bar!" });
console.log(output);
