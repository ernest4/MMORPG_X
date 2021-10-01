const merge = require("webpack-merge");
const common = require("./webpack.common.cjs");

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  output: {
    // path: path.resolve(__dirname, "dist"),
    // publicPath: "/game/",
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[contenthash].chunk.js",
  },
});
