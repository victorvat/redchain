var webpack = require('webpack');
//var ExtractTextPlugin = require('extract-text-webpack-plugin');
//var nodeExternals = require('webpack-node-externals');

var isProduction = process.env.NODE_ENV === 'production';

var clientLoaders = [];
//var commonLoaders = [
//    {
//        test: /\.json$/,
//        loader: 'json-loader'
//    }
//];

module.exports = [
    {
        entry: './client/assets/main.jsx',
        output: {
            path: './build',
            publicPath: '/',
            filename: 'main.js'
        },
        resolve: {
            extensions: ['.js', '.jsx']
        },
        // plugins: clientLoaders.concat([
        //     new ExtractTextPlugin('index.css', {
        //         allChunks: true
        //     })
        // ]),
        module: {
            loaders: [
                {
                    test: /\.jsx$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    query: {
                        presets: ['es2015', 'react']
                    }
                }
                // ,
                // {
                //     test: /\.scss$/,
                //     loader: ExtractTextPlugin.extract('css!sass')
                // }
            ]
        }
    }
];
