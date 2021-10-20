import path from "path";
import { Configuration } from "webpack";
// import { WebpackManifestPlugin } from "webpack-manifest-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { DEVELOPMENT, PORT } from "./src/shared/utils/environment";

const nodeModulesPath = path.resolve(__dirname, "node_modules");
const targets = DEVELOPMENT ? { chrome: "79", firefox: "72" } : "> 0.25%, not dead";

const config: Configuration = {
  mode: DEVELOPMENT ? "development" : "production",
  devtool: DEVELOPMENT ? "inline-source-map" : false,
  entry: ["./src/client/index"],
  output: {
    path: path.join(__dirname, "dist", "statics"),
    filename: DEVELOPMENT ? "[name].bundle.js" : "[name].[contenthash].js",
    chunkFilename: DEVELOPMENT ? "[name].chunk.js" : "[name].[contenthash].chunk.js",
    publicPath: DEVELOPMENT ? "/" : "/statics/",
  },
  resolve: {
    // alias: { // doesnt work ?!?!
    //   JestHelpers: path.resolve(path.join(__dirname, "src", "tests", "jestHelpers")),
    // },
    extensions: [".js", ".ts", ".tsx"],
    fallback: {
      // util: require.resolve("util/"),
      buffer: require.resolve("buffer/"),
    },
  },
  optimization: {
    minimize: !DEVELOPMENT,
    splitChunks: {
      cacheGroups: {
        vendors: { test: /[\\/]node_modules[\\/]/, name: "vendors", chunks: "all", priority: 10 },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/, nodeModulesPath],
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/env", { modules: false, targets }],
              "@babel/react",
              "@babel/typescript",
            ],
            plugins: [
              "@babel/proposal-numeric-separator",
              "@babel/plugin-transform-runtime",
              ["@babel/plugin-proposal-decorators", { legacy: true }],
              ["@babel/plugin-proposal-class-properties", { loose: true }],
              "@babel/plugin-proposal-object-rest-spread",
            ],
          },
        },
      },
      { test: /\.m?js/, resolve: { fullySpecified: false } },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { importLoaders: 1, modules: true, sourceMap: DEVELOPMENT },
          },
          { loader: "postcss-loader", options: { sourceMap: DEVELOPMENT } },
        ],
      },
      // {
      //   test: /.jpe?g$|.gif$|.png$|.svg$|.woff$|.woff2$|.ttf$|.eot$/,
      //   use: "url-loader?limit=10000",
      // },
    ],
  },
  // @ts-ignore
  devServer: {
    port: 8085, //WEBPACK_PORT
    overlay: DEVELOPMENT,
    open: DEVELOPMENT,
    contentBase: path.join(__dirname, "public"),
    openPage: `http://localhost:${8085}/`,
    publicPath: "/",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([{ from: "public" }]),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
      chunkFilename: "[id].[contenthash].chunk.css",
    }),
    new HtmlWebpackPlugin({ template: path.resolve(__dirname, "public/index.html") }),
  ],
  externals: { react: "React", "react-dom": "ReactDOM" },
};

export default config;
