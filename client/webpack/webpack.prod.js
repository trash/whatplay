var webpack = require('webpack');
var { merge } = require('webpack-merge');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

const ENV = (process.env.NODE_ENV = process.env.ENV = 'production');

module.exports = merge(commonConfig, {
    devtool: 'source-map',

    output: {
        path: helpers.root('prod-build/'),
        publicPath: '/',
        filename: '[name].[hash].js',
        chunkFilename: '[id].[hash].chunk.js'
    },

    optimization: {
        minimize: true
    },

    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        // new webpack.optimize.UglifyJsPlugin({ // https://github.com/angular/angular/issues/10618
        //     mangle: {
        //         keep_fnames: true
        //     }
        // }),
        new webpack.LoaderOptionsPlugin({
            htmlLoader: {
                minimize: false // workaround for ng2
            }
        })
    ]
});
