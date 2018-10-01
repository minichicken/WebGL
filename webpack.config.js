"use strict";
const path = require("path");

const defaultConfig = {
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(txt|vert|frag)$/,
        use: 'raw-loader'
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
    FirstWeek: './FirstWeek/main.ts',
  },
  ...defaultConfig
};

const thirdWeekConfig = {
  entry: {
    ThirdWeek: './ThirdWeek/main.ts',
  },
  ...defaultConfig
};

module.exports = [firstWeekConfig, thirdWeekConfig];
