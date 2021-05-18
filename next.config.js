require('dotenv').config()
const webpack = require('webpack')
const path = require('path')

module.exports = {
  webpack: (config) => {
    config.plugins.push(new webpack.EnvironmentPlugin(process.env))
    return config
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}
