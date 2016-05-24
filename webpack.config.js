'use strict'

var
	webpack  = require('webpack')
	, pkg    = require('./package.json')
	, banner = `${pkg.name} - ${pkg.description}
Author: ${pkg.author}
Version: v${pkg.version}
Url: ${pkg.homepage}
License(s): ${pkg.license}`

module.exports = {
	entry: './src/lea.js',
	output: {
		path: './build',
		filename: 'lea.js',
		library: 'lea',
		libraryTarget: 'umd'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel',
				query: {
					presets: ['es2015']
				}
			}
		]
	},
	babel: {
		plugins: ['add-module-exports']
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"development"'
			}
		})
	],
	devtool: 'source-map'
}

if ( process.env.NODE_ENV === 'production' ) {
	module.exports.output.path = './dist'
	module.exports.devtool     = '#source-map'
	module.exports.plugins     = (module.exports.plugins || []).concat([
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		}),
		new webpack.BannerPlugin(banner),
		new webpack.optimize.OccurenceOrderPlugin()
	])
}
