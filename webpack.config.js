const dotenv = require('dotenv').config({ path: __dirname + '/.env' + (process.env.TESTNET ? '.testnet' : '') });
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const Encore = require('@symfony/webpack-encore');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

// Add global config variables to both process.env and local dotenv:
Object.entries({
    APP_ENV: process.env.NODE_ENV,
    TESTNET: process.env.TESTNET === '1',
}).forEach(([ key, value ]) => {
    process.env[key] = JSON.stringify(value);
    dotenv.parsed[key] = value;
});

// Put global config variables along with .env contents to the app scope:
Encore.configureDefinePlugin((options) => {
    const env = Object.entries(dotenv.parsed).map(([ key, value ]) => [
        `process.env.${key}`, JSON.stringify(value),
    ]);

    Object.assign(options, Object.fromEntries(env));
});

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

Encore.configureDevServerOptions((options) => Object.assign(options, {
    host: process.env.APP_DEV_SERVER_HOST || '127.0.0.1',
    port: process.env.APP_DEV_SERVER_PORT || '3000',
    allowedHosts: 'all',
    compress: false,
}));

const globalPlugins = [
    new HtmlWebpackPlugin({
        template: './src/index.ejs',
        filename: __dirname + '/dist/index.html',
        inject: false,
        favicon: `./src/favicon${process.env.TESTNET === '1' ? '-testnet' : ''}.svg`,
        minify: {
            collapseWhitespace: Encore.isProduction(),
            removeComments: Encore.isProduction(),
        },
    }),
];

const prodPlugins = !Encore.isProduction() ? [] : [
    new BundleAnalyzerPlugin({
        analyzerMode: 'static',
    }),
];

globalPlugins.concat(prodPlugins).forEach(Encore.addPlugin);

if (Encore.isProduction()) {
    Encore.enableVersioning();
    Encore.cleanupOutputBeforeBuild();
}

module.exports = Encore.getWebpackConfig();
