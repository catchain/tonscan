const dotenv = require('dotenv').config({ path: __dirname + '/.env' + (process.env.TESTNET ? '.testnet' : '') });
const Encore = require('@symfony/webpack-encore');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore.enableSassLoader()
    .enableVueLoader(() => {}, { runtimeCompilerBuild: false })
    .setOutputPath('dist/')
    .setPublicPath('/')
    .addEntry('application', './src/js/app.js')
    .addStyleEntry('style', './src/sass/app.scss')
    .copyFiles({ from: './src', to: '[name].[ext]', pattern: /addrbook\.json$/ })
    .copyFiles({ from: './src', to: '[name].[ext]', pattern: /favicon\.ico$/ })
    .configureImageRule({}, function(config) { config.test = /\.(png|jpg|jpeg|webp)$/ })
    .configureFontRule({ filename: 'font-[name].[hash:8][ext]' })
    .enableSingleRuntimeChunk()
    .enableSourceMaps()
    .splitEntryChunks()
    .addAliases({
        '~': path.resolve(__dirname + '/src/js'),
        '@img': path.resolve(__dirname + '/src/img'),
        '@fonts': path.resolve(__dirname + '/src/fonts'),
    });

Encore.addLoader({
    test: /\.svg/,
    loader: 'vue-svg-loader',
    options: {
        svgo: {
            plugins: [{ removeDimensions: false }, { removeViewBox: false }],
        },
    },
});

Encore.configureDefinePlugin((options) => {
    const vars = { ...dotenv.parsed,
        NODE_ENV: process.env.NODE_ENV,
        TESTNET: process.env.TESTNET === '1',
    };

    Object.entries(vars).forEach(([ key, value ]) => options[`process.env.${key}`] = JSON.stringify(value));
});

Encore.addPlugin(new HtmlWebpackPlugin({
    template: './src/index.ejs',
    filename: __dirname + '/dist/index.html',
    inject: false,
    favicon: `./src/favicon${process.env.TESTNET === '1' ? '-testnet' : ''}.svg`,
    minify: {
        collapseWhitespace: Encore.isProduction(),
        removeComments: Encore.isProduction(),
    },
}));

Encore.isProduction() && Encore.enableVersioning();
Encore.isProduction() && Encore.cleanupOutputBeforeBuild();

module.exports = Encore.getWebpackConfig();
