const path = require("path");
const testhelpers = require("@elo/elo-cli");
testhelpers.init();
module.exports = {
    publicPath: "./",
    css: {
        extract: false,
    },
    devServer: {
        allowedHosts: ["all"],
        proxy: {
        [testhelpers.getIxContext()]: {
            target: testhelpers.getIxServer(),
            secure: false,
            logLevel: `debug`,
        },
        },
    },
    filenameHashing: true,
    productionSourceMap: true,
    configureWebpack: {
        resolve: {
        alias: {
            "@elo/core": path.resolve("./node_modules/@elo/core"),
            "@elo/session": path.resolve("./node_modules/@elo/session"),
        },
        },
    },
};