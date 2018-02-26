module.exports = {
    entry: ['babel-polyfill', './src/index.js'],
    output: {
        filename: './build/bundle.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    },
    watch: true
}