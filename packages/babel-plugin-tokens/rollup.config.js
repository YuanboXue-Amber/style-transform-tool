import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import json from "@rollup/plugin-json";
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
    external: Object.keys(packageJson.dependencies),
    plugins: [esbuild(), json()],
    output: [
      {
        dir: cjsDir,
        format: "cjs",
        preserveModules: true,
        preserveModulesRoot: "src",
        sourcemap: true,
        entryFileNames: "[name].js",
        exports: "named",
      },
      {
        dir: esmDir,
        format: "es",
        preserveModules: true,
        preserveModulesRoot: "src",
        sourcemap: true,
        entryFileNames: "[name].js",
        exports: "named",
      },
    ],
  },
  {
    input: "src/index.js",
    external: [],
    plugins: [
      dts(),
      json(),
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
