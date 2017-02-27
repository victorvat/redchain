var webpack = require('webpack');
//var ExtractTextPlugin = require('extract-text-webpack-plugin');
//var nodeExternals = require('webpack-node-externals');

var isProduction = process.env.NODE_ENV === 'production';

var defLoaders = [
    {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: { presets: ['es2015', 'react'] }
    }
]

var defOutput = {
    path: './build',
    publicPath: '/',
}

module.exports = [
    {
        entry: './client/main.jsx',
        output: Object.assign({filename: 'main.js'}, defOutput),
        resolve: { extensions: ['.js', '.jsx'] },
        module: { loaders: defLoaders }
    },
    {
        entry: './client/login.jsx',
        output: Object.assign({filename: 'login.js'}, defOutput),
        resolve: { extensions: ['.js', '.jsx'] },
        module: { loaders: defLoaders }
    }
];
