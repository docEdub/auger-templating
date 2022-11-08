const path = require("path");
const fs = require('fs');
const appDirectory = fs.realpathSync(process.cwd());

module.exports = {
    entry: path.resolve(appDirectory, "src/Cabbage/cabbageTemplateHelper.ts"),
    output: {
        path: path.resolve(appDirectory, ".build/.root/src/Cabbage"),
        filename: 'cabbageTemplateHelper.js'
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                enforce: "pre",
                use: ["source-map-loader"],
            }
        ]
    },
    mode: "development"
};
