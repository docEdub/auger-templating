const path = require("path");
const WebpackTouch = require('webpack-touch');

module.exports = {
    entry: {
        ["src/Cabbage/cabbageTemplateHelper"]: path.resolve(__dirname, "src/Cabbage/cabbageTemplateHelper.ts"),
        ["src/Csound/csoundTemplateHelper"]: path.resolve(__dirname, "src/Csound/csoundTemplateHelper.ts"),
    },
    output: {
        clean: true,
        filename: '[name].js',
        path: path.join(__dirname, '.build/.root'),
        publicPath: '/',
    },
    plugins: [
        new WebpackTouch({ filename: '.build/.root/.webpack.stamp', delay: 0 })
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
