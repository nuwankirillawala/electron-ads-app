const path = require('path');

module.exports = {
  mode: 'development', // or 'production'
  entry: './src/renderer/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/images',
            },
          },
        ],
      }
    ]
  },
//   plugins: [
//     new CopyWebpackPlugin({
//       patterns: [
//         { from: 'public', to: '' }  // Copy everything from 'public' to the output directory
//       ]
//     })
//   ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  target: 'electron-renderer'
};
