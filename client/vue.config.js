const path = require("path");
const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  outputDir: path.join(__dirname, "../backend/public/"),
  transpileDependencies: true,
  devServer: {
    proxy: {
      api: {
        target: "https://132.145.98.197:3002",
      },
    },
  },
});
