const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  optimization: {
    minimizer: [
      new TerserPlugin(),
      new MiniCssExtractPlugin({
        filename: "[name].css",
      }),
    ],
  },
  // plugins: [
  //     new MiniCssExtractPlugin({
  //   filename: "[name].css",
  // }),
  // ],
});
