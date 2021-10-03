import path from "path";
import { Configuration } from "webpack";
// import { WebpackManifestPlugin } from "webpack-manifest-plugin";
import cssnano from "cssnano";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { DEVELOPMENT } from "./src/shared/utils/environment";

// import { SERVER_PORT, IS_DEV, WEBPACK_PORT } from "./src/server/config";

// const IS_DEV = process.env.NODE_ENV !== "production";

// const plugins = [new WebpackManifestPlugin()];

// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
// plugins.push(new BundleAnalyzerPlugin());

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
    publicPath: "/statics/",
  },
  resolve: { extensions: [".js", ".ts", ".tsx"] },
  optimization: {
    minimize: !DEVELOPMENT,
    splitChunks: {
      cacheGroups: {
        vendors: { test: /[\\/]node_modules[\\/]/, name: "vendors", chunks: "all", priority: 10 },
        material: {
          test: /[\\/]node_modules[\\/]@material-ui[\\/]/,
          name: "material-ui",
          chunks: "all",
          priority: 20,
        },
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
          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: true,
              localsConvention: "camelCase",
              sourceMap: DEVELOPMENT,
            },
          },
          {
            loader: "postcss-loader",
            options: { sourceMap: DEVELOPMENT, plugins: DEVELOPMENT ? [cssnano()] : [] },
          },
        ],
      },
      // {
      //   test: /.jpe?g$|.gif$|.png$|.svg$|.woff$|.woff2$|.ttf$|.eot$/,
      //   use: "url-loader?limit=10000",
      // },
    ],
  },
  // devServer: {
  //   port: WEBPACK_PORT,
  //   overlay: DEVELOPMENT,
  //   open: DEVELOPMENT,
  //   openPage: `http://localhost:${SERVER_PORT}`,
  // },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([{ from: "public" }]),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
      chunkFilename: "[id].[contenthash].chunk.css",
    }),
    new HtmlWebpackPlugin({ template: path.resolve(__dirname, "public/index.html") }),
  ],
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
};

export default config;
