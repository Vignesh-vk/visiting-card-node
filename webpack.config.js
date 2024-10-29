const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  // other configurations...
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'node_modules/tesseract.js-core/tesseract-core-simd.wasm', to: 'public/' }
      ],
    }),
  ],
};
