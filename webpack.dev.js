const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  output: {
    // path: path.resolve(__dirname, "dist"),
    // publicPath: "/",
    filename: "[name].bundle.js",
    chunkFilename: "[name].chunk.js",
  },
  // devServer: {
  //   contentBase: "./dist",
  // },
});
