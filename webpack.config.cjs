const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: process.env.NODE_ENV === "production" ? "production" : "development",

  entry: "./src/typescript/index.ts",

  devtool:
    process.env.NODE_ENV === "production" ? "source-map" : "inline-source-map",

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },

  resolve: {
    extensions: [".ts", ".js"],
  },

  output: {
    filename: "[name].bundle.js",
    chunkFilename: "[name].chunk.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },

  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      inject: true,
    }),
  ],

  performance: {
    hints: process.env.NODE_ENV === "production" ? "warning" : false,
    maxAssetSize: 250 * 1024,
    maxEntrypointSize: 250 * 1024,
  },
};
