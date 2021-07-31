const { VueLoaderPlugin } = require("vue-loader");
const Dotenv = require("dotenv-webpack");
module.exports = {
  module: {
    rules: [
      // ... other rules
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
    ],
  },
  plugins: [
    // make sure to include the plugin!
    new VueLoaderPlugin(),
    new Dotenv(),
  ],
  resolve: {
    alias: {
      vue: "vue/dist/vue.js",
    },
  },
  runtimeCompiler: true,
};
