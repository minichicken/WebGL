const path = require("path");
const nodeExternals = require('webpack-node-externals');

const config = {
    entry: {
        FirstWeek: './FirstWeek/main.ts',
        ThirdWeek: './ThirdWeek/main.ts',
    },
    devtool: 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ]
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist')
    },
    target: 'node',
    externals: [nodeExternals()]
};

module.exports = config;
