const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin') // eslint-disable-line
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = function(env = {}) {
  const outputPath = path.resolve(__dirname, env.outputPath || 'dist')

  const output = {
    path: outputPath,
    filename: 'app.js',
    publicPath: './'
  }

  const plugins = [
    new MonacoWebpackPlugin({
      languages: ['glsl'],
      features: ['coreCommands']
    })
  ]

  let optimization = {}

  if (!env.production) {
    plugins.push(new webpack.HotModuleReplacementPlugin())
  }
  // const buildFolder = env.folder

  if (env.production) {
    plugins.push(
      new HtmlWebpackPlugin({
        template: './index.html',
        filename: 'index.html',
        inject: false
      }),
      new CopyWebpackPlugin([
        {
          from: path.join(__dirname, './src/fragments'),
          to: path.resolve(__dirname, './dist/src/fragments'),
          ignore: ['*.js', '*.html']
        },
        {
          from: path.join(__dirname, './css'),
          to: path.resolve(__dirname, './dist/css')
        }
      ])
    )

    optimization = {}
  }

  return {
    mode: env.production ? 'production' : 'none',
    devtool: env.production ? '' : 'cheap-module-eval-source-map',
    entry: ['./src/app.js'],
    output,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },

    module: {
      rules: [
        {
          test: /\.(frag|vert|glsl)$/,
          use: {
            loader: 'glsl-shader-loader',
            options: {}
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: outputPath + '/' + 'img/[name].[hash:7].[ext]'
          }
        }
      ]
    },

    stats: 'errors-only',
    // lets you precisely control what bundle information gets displayed

    devServer: {
      contentBase: path.join(__dirname, env.server || '.'),
      compress: true,
      port: 3000,
      hot: true,
      open: true
      // ...
    },

    plugins,
    optimization
  }
}
