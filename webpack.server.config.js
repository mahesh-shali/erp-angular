const path = require("path");

module.exports = {
  cache: {
    type: "filesystem",
    cacheDirectory: path.resolve(__dirname, ".webpack_cache"),
  },
  output: {
    filename: "main.cjs", // 👈 forces .cjs instead of .js
  },
};
