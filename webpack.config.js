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
    .addAliases({ '~': path.resolve(__dirname + '/src/js') })
    .enableSingleRuntimeChunk()
    .enableSourceMaps()
    .splitEntryChunks();

Encore.configureDefinePlugin((options) => {
    const vars = { ...dotenv.parsed,
        NODE_ENV: process.env.NODE_ENV,
        TESTNET: process.env.TESTNET == '1',
    };

    Object.entries(vars).forEach(([ key, value ]) => options[`process.env.${key}`] = JSON.stringify(value));
});

Encore.addPlugin(new HtmlWebpackPlugin({
    template: './src/index.ejs',
    filename: __dirname + '/dist/index.html',
    inject: false,
    minify: {
        collapseWhitespace: Encore.isProduction(),
        removeComments: Encore.isProduction(),
    },
}));

Encore.isProduction() && Encore.enableVersioning();
Encore.isProduction() && Encore.cleanupOutputBeforeBuild();

module.exports = Encore.getWebpackConfig();
