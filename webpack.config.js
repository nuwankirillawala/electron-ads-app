const path = require("path");

module.exports = {
  mode: "development", // Change to 'production' for production build
  entry: "./src/renderer/index.jsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/", // Serves files from the root
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "assets/images",
              publicPath: "assets/images",
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public"), // Serve from 'public'
    },
    port: 9000, // Port for Webpack Dev Server
    historyApiFallback: {
      index: "/index.html", // Ensure that index.html is served for all routes
    },
    hot: true, // Enable hot reloading
  },
  target: "web", // Target web for Webpack Dev Server
};
