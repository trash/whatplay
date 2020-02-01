const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const helpers = require('./helpers');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ENV = process.env.NODE_ENV;
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const wtpConfigValues = {
    auth0ClientId: JSON.stringify(process.env.AUTH0_CLIENT_ID),
    auth0Domain: JSON.stringify(process.env.AUTH0_DOMAIN),
    auth0Audience: JSON.stringify(process.env.AUTH0_AUDIENCE),
    serverUrl: JSON.stringify(process.env.SERVER_URL)
};

// console.log('webpack config values', wtpConfigValues);

module.exports = {
    entry: {
        app: [helpers.root('/src/app.tsx')]
    },
    plugins: [
        new webpack.DefinePlugin({
            WTP_CONFIG: wtpConfigValues
        }),
        new HtmlWebpackPlugin({
            template: helpers.root('/index.html')
        })
    ],
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.jsx'],
        plugins: [
            // Have to do this because of the weirdness of where we have the tsconfig.json
            new TsconfigPathsPlugin({
                configFile: helpers.root('../tsconfig.json')
            })
        ]
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
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                loader: 'file-loader'
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
