const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const helpers = require('./helpers');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ENV = process.env.NODE_ENV;

module.exports = {
    entry: {
        app: [helpers.root('/src/app.ts')]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(ENV)
            },
            WTP_CONFIG: {
                auth0Domain: JSON.stringify(process.env.AUTH0_DOMAIN),
                serverUrl: JSON.stringify(process.env.SERVER_URL)
            }
        }),
        new HtmlWebpackPlugin({
            template: helpers.root('/index.html')
        })
    ],
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: [/node_modules/],
                loader: 'ts-loader'
            },
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['preset-env', 'react']
                }
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader' // creates style nodes from JS strings
                    },
                    {
                        loader: 'css-loader' // translates CSS into CommonJS
                    },
                    {
                        loader: 'less-loader'
                    }
                ]
            }
        ]
    },
    devServer: {
        historyApiFallback: true,
        port: 8998
    }
};
