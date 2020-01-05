const webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;

module.exports = webpackMerge(commonConfig, {
    mode: 'development',

    devtool: 'eval-source-map',

    output: {
        path: helpers.root('build/'),
        filename: '[name]-bundle.js',
        publicPath: '/',
        chunkFilename: '[id].chunk.js'
    },

    plugins: [
        //     new BundleAnalyzerPlugin({
        //         analyzerPort: 1337
        //     })
    ],

    devServer: {
        historyApiFallback: true,
        stats: 'minimal',
        port: 3001
        // proxy: {
        //    "/api": "http://localhost:8999"
        // }
    }
});
