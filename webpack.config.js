const path = require("path");

const config = {
    entry: {
        FirstWeek: './FirstWeek/main.ts',
        ThirdWeek: './ThirdWeek/main.ts',
    },
    devtool: 'source-map',
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
    }
};

module.exports = config;
