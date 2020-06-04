module.exports = {
    devServer: {
        overlay: { // 让浏览器 overlay 同时显示警告和错误
            warnings: true,
            errors: true
        },
        open: true,
        // host: "localhost",
        // port: "8080",
        https: false,
        hotOnly: false, // 热更新
        proxy: {
            "/api": {
                target: "https://www.easy-mock.com/mock/5bc75b55dc36971c160cad1b/sheets", // 目标代理接口地址
                secure: false,
                changeOrigin: true, // 开启代理，在本地创建一个虚拟服务端
                // ws: true, // 是否启用websockets
                pathRewrite: {
                    "^/api": "/"
                }
            }
        }
    },
    // 适配
    chainWebpack: config => {
        config.module
            .rule('less','css')

            .oneOf('vue')

            .use('px2rem-loader')

            .loader('px2rem-loader')

            .before('postcss-loader') // this makes it work.

            .options({
                remUnit: 192, //代表的是 1rem = ？px  设计稿是 1920px ，那么这里的比例就是 1/10
                remPrecision: 8
            })
            .end()
    }
};