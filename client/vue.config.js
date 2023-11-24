const path = require("path");
const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  outputDir: path.join(__dirname, "../backend/public/"),
  transpileDependencies: true,
  devServer: {
    proxy: {
      api: {
        target: "http://132.145.98.197:3002",
      },
    },
  },
  // publicPath: process.env.NODE_ENV === "production" ? "/login/" : "/",
});
