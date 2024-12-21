const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");
const { use } = require("react");
module.exports = {
  mode: "development",
  entry: {
    popup: path.resolve("./src/popup/popup.tsx"),
    options: path.resolve("./src/options/options.tsx"),
    background: path.resolve("./src/background/background.js"),
  },
  devtool: "cheap-module-source-map",
  module: {
    rules: [
      {
        use: "ts-loader",
        test: /\.tsx$/,
        exclude: /node_modules/,
      },
      {
        use: ["style-loader", "css-loader"],
        test: /\.css$/i,
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve("./src/static/manifest.json"),
          to: path.resolve("dist"),
        },
        { from: path.resolve("src/static/icon.png"), to: path.resolve("dist") },
      ],
    }),
    ...getHtmlPlugins(["popup", "options"]),
  ],
  resolve: { extensions: [".ts", ".tsx", ".js"] },
  output: { filename: "[name].js" },
  optimization: {
    splitChunks: {
      chunks(chunk) {
        return chunk.name !== "my-excluded-chunk";
      },
    },
  },
};

function getHtmlPlugins(chunks) {
  return chunks.map(
    (chunk) =>
      new HtmlPlugin({
        title: "RAYdar",
        filename: `${chunk}.html`,
        chunks: [chunk],
      })
  );
}
