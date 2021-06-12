const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './public/js/app.js', //Archivo de entrada
    output: {
        filename : 'bundle.js',
        path: path.join(__dirname, './public/dist')//Nos va a crear una nueva carpeta llamada dist en public
    },
    module: {
        rules : [
            {
                test: /\.m?js$/,//Va aidentificar que archivos va a procesar. En este caso busca todos los archivos que son js
                use:{
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]    
    }
}