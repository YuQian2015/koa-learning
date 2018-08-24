const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const node_modules = path.resolve(__dirname, 'node_modules');
const pathToReact = path.resolve(node_modules, 'react/dist/react.min.js');

const CompressionPlugin = require("compression-webpack-plugin")
const Visualizer = require('webpack-visualizer-plugin');



module.exports = {
  entry: [// 'webpack/hot/dev-server',
    // 'webpack-dev-server/client?http://localhost:8080',
    path.resolve(__dirname, 'views/main.js')],
  output: {
    path: path.resolve(__dirname, 'build'),
    // publicPath: '/assets/', //表示资源的发布地址，当配置过该属性后，打包文件中所有通过相对路径引用的资源都会被配置的路径所替换。
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/, // 匹配'js' or 'jsx' 后缀的文件类型
        exclude: /(node_modules|bower_components)/, // 排除某些文件
        loader: 'babel-loader', // 使用'babel-loader'
        query: { // 参数
          "presets": ["es2015", "react", "stage-3"]
        }
      }, {
        test: /\.css$/, // Only .css files
        use: ['style-loader', 'css-loader'] // Run both loaders 后者是为了遍历你的css。前者是为了进行style标记生成。
      }, {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          // use:指需要什么样的loader去编译文件,这里由于源文件是.css所以选择css-loader
          // fallback:编译后用什么loader来提取css文件
          // publicfile:用来覆盖项目publicPath,生成该css文件的文件路径
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader']
        })
          //[
          // {
          //   loader: "style-loader" // creates style nodes from JS strings
          // }, {
          //   loader: "css-loader" // translates CSS into CommonJS
          // }, {
          //   loader: "less-loader" // compiles Less to CSS
          // }

          // "style-loader","css-loader","less-loader"
          //]
      }, {
        test: /\.(png|jpg)$/,
        // loader: 'url-loader?limit=1000&name=images/[path][name].[ext]'
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[ext]',
              // publicPath: '',
              outputPath: 'images/',
              limit: 1000,
            },
          }
        ]
      }, {
        test: /\.(mp3|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              // publicPath: '',
              outputPath: 'assest/',
            },
          }
        ]
        // loader: 'file-loader'
      }
    ],
    noParse: [pathToReact]
  },
  plugins: [
    new HtmlWebpackPlugin(
      {
        title: '健康饮食',
        template: 'views/index.ejs',
        // favicon:'./src/img/favicon.ico',
        minify: {
          // removeAttributeQuotes: true,
          // collapseWhitespace: true,
          removeComments:true,
          preserveLineBreaks: false
        }
      }),
    new ExtractTextPlugin("styles.css"),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: {removeAll: true } },
      canPrint: true
    }),
    new UglifyJsPlugin(),
    new CompressionPlugin({
        asset: "[path].gz[query]",
        algorithm: "gzip",
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.8
    }),
    new Visualizer()
  ]
};
