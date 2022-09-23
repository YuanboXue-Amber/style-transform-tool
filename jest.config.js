const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./packages/tsconfig/base.json");

module.exports = {
  preset: "ts-jest",
  rootDir: ".",
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  modulePathIgnorePatterns: ["dist"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>",
  }),
};
