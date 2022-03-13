import path from "path";
import { Configuration } from "webpack";
import webpackDevServer from 'webpack-dev-server';
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config: Configuration = {
    entry: "./src/index.ts",
    mode: "development",
    module: {
        rules: [
            {
                test: /\.loadResources$/,
                use: [{
                    loader: path.resolve('src/Resources/loadResources.ts'),
                }]
            },
            {
                test: /\.(html)$/,
                use: ['html-loader']
            },
            {
                test: /\.(ts|js)?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-typescript"],
                    },
                },
            },
            {
                test: /\.scss$/,
                use:
                [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.css$/,
                use:
                [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(jpg|png|gif|svg)$/,
                use:
                [
                    {
                        loader: 'file-loader',
                        options:
                        {
                            outputPath: 'assets/images/'
                        }
                    }
                ]
            },
            {
                test: /\.(glb|gltf|fbx|obj)$/,
                use:
                [
                    {
                        loader: 'file-loader',
                        options:
                        {
                            outputPath: 'assets/models/'
                        }
                    }
                ]
            },
            {
                test: /\.(mp3)$/,
                use:
                [
                    {
                        loader: 'file-loader',
                        options:
                        {
                            outputPath: 'assets/audios/'
                        }
                    }
                ]
            },
            {
                test: /\.(glsl|vs|fs|vert|frag)$/,
                exclude: /node_modules/,
                use: [
                    'raw-loader',
                    'glslify-loader'
                ]
            }
        ],
    },
    plugins:
        [
            new CopyWebpackPlugin({
                patterns: [ 
                    { from: path.resolve(__dirname, './static') } 
                ]
            }),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, './src/index.html'),
                minify: true
            })
        ],
    resolve: {
        extensions: [".ts", ".js"],
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "main.js",
    },
    devServer: ({
        static: path.join(__dirname, "dist"),
        compress: true,
        port: 4000,
    } as webpackDevServer.Configuration),
};


export default config;