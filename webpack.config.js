const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
 entry: {
   app: './src/index.js'
 },
 devtool: 'inline-source-map',
 devServer: {
   contentBase: './dist'
 },
 module: {
  rules: [
    {
      test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }
  ]
},
 plugins: [
   new CleanWebpackPlugin(['dist']),
   new HtmlWebpackPlugin({
     title: 'Development',
     template: 'src/index.html'
   })
 ],
 output: {
   filename: '[name].bundle.js',
   path: path.resolve(__dirname, 'dist')
 },
 devServer: {
   before (app) {

   }
 }
}
