const path = require("path");
const WebpackTouch = require('webpack-touch');

const CsoundTemplateHelpers_BuildOutputDir = path.join(__dirname, '..', '.build', '.output', 'CsoundTemplateHelpers')

module.exports = {
    entry: {
        ["cabbageTemplateHelper"]: path.resolve(__dirname, "src/cabbageTemplateHelper.ts"),
        ["csoundTemplateHelper"]: path.resolve(__dirname, "src/csoundTemplateHelper.ts"),
    },
    output: {
        // clean: true, // NB: Cleaning .build/.output deletes the output .csd, which disrupts Cabbage's live reload.
        filename: '[name].js',
        path: path.join(CsoundTemplateHelpers_BuildOutputDir, 'src'),
        publicPath: '/',
    },
    plugins: [
        new WebpackTouch({ filename: path.join(CsoundTemplateHelpers_BuildOutputDir, '.webpack.stamp'), delay: 0 })
    ],
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
    mode: "development",

    // Allow node modules to be used in TypeScript, e.g. `const fs = require(fs)`.
    target: "node",
};