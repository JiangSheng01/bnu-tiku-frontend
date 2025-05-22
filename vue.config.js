const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8081,
    host: "0.0.0.0", // 接受所有域名
    // disableHostCheck: true, // Vue CLI 4.x 及以下有效，5.x后已废弃
    allowedHosts: "all", // webpack5支持
    client: {
      overlay: {
        warnings: false,
        // runtimeErr: (error) => {
        //   const ignoreErrors = [
        //     "ResizeObserver loop limit exceeded",
        //     "ResizeObserver loop completed with undelivered notifications.",
        //   ];
        //   if (ignoreErrors.includes(error.message)) {
        //     return false;
        //   }
        // },
      },
    },
  },
});
