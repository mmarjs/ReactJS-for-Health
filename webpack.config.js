const path = require('path');

const config = {
    node: {
        console: false,
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    entry: './client/index.jsx',
    output: {
        path: path.resolve(__dirname, 'client'),
        filename: 'index.js'
    },
    devServer: {
        contentBase: path.join(__dirname, ""),
        compress: true,
        // port: 9000
    },
    module: {
        rules: [
            {test: /\.(js|jsx)$/, exclude: /node_modules/, use: 'babel-loader'},
            {test: /\.css$/, use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: '[name]__[local]___[hash:base64:5]'
                        }
                    }
                ]
            }
        ]
    }
};

module.exports = config;