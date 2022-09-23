import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import copy from "rollup-plugin-copy";
import path from "path";

const { cleanupPackageJson } = require("../../build");
const packageJson = require("./package.json");

const esmDir = "dist/" + path.dirname(packageJson.module);
const cjsDir = "dist/" + path.dirname(packageJson.main);
const dtsDir = "dist/" + path.dirname(packageJson.typings);

export default [
  {
    input: "src/index.js",
    external: [...Object.keys(packageJson.dependencies), "fs", "path"],
    plugins: [esbuild()],
    output: [
      {
        dir: cjsDir,
        format: "cjs",
        preserveModules: true,
        preserveModulesRoot: "src",
        sourcemap: true,
        entryFileNames: "[name].js",
      },
      {
        dir: esmDir,
        format: "es",
        preserveModules: true,
        preserveModulesRoot: "src",
        sourcemap: true,
        entryFileNames: "[name].js",
      },
    ],
  },
  {
    input: "src/index.js",
    external: [],
    plugins: [
      dts(),
      copy({
        targets: [
          { src: "./README.md", dest: "dist/" },
          {
            src: "./package.json",
            dest: "dist/",
            transform: (content) => cleanupPackageJson(content),
          },
        ],
      }),
    ],
    output: {
      dir: dtsDir,
      format: "es",
      preserveModules: true,
    },
  },
];
