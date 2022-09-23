const { defineConfig } = require("tsup");
const glob = require("glob");

const entryPoints = [
  ...glob.sync("src/**/!(*.spec).js"),
  ...glob.sync("src/**/*.ts"),
];

module.exports = defineConfig({
  entry: entryPoints,
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  format: ["esm", "cjs"],
});
