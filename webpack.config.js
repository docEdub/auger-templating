const path = require("path");
const fs = require('fs');

module.exports = {
    entry: {
        ["src/Cabbage/cabbageTemplateHelper"]: path.resolve(__dirname, "src/Cabbage/cabbageTemplateHelper.ts"),
        ["src/CsoundQt/csoundQtTemplateHelper"]: path.resolve(__dirname, "src/CsoundQt/csoundQtTemplateHelper.ts")
    },
    output: {
        clean: true,
        filename: '[name].js',
        path: path.join(__dirname, '.build/.root'),
        publicPath: '/',
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
