"use strict";
const path = require("path");

const defaultConfig = {
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.(txt|vert|frag)$/,
                use: 'raw-loader',
                exclude: /node_modules/
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    }
};

const firstWeekConfig = {
    entry: {
        FirstWeek: './FirstWeek/main.ts'
    },
    ...defaultConfig
};

const thirdWeekConfig = {
    entry: {
        ThirdWeek: './ThirdWeek/main.ts'
    },
    ...defaultConfig
};

const fourthWeekConfig = {
    entry: {
        FourthWeek: './FourthWeek/main.ts'
    },
    ...defaultConfig
};

const splitTheeJSWebGL2Config = {
    entry: {
        SplitThreeJSWebGL2: './SplitThreejsWebGL2/main.ts'
    },
    ...defaultConfig
}

module.exports = [firstWeekConfig, thirdWeekConfig, fourthWeekConfig, splitTheeJSWebGL2Config];
