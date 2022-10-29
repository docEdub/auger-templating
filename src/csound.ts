import Handlebars from "handlebars/dist/handlebars.js"

console.log("Hello csound.ts!");

const template = Handlebars.compile("foo is {{foo}}");
const output = template({ foo: "bar!" });
console.log(output);
