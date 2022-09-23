const shorthandsPluginPackageJson = require("./packages/babel-plugin-shorthands/package.json");
const tokensPluginPackageJson = require("./packages/babel-plugin-tokens/package.json");

function cleanupPackageJson(content) {
  console.log("cleanup package.json");
  const packageJson = JSON.parse(content);
  packageJson.scripts = undefined;
  packageJson.devDependencies = undefined;

  const dependencies = { ...packageJson.dependencies };
  if (dependencies["v9helper-babel-plugin-shorthands"]) {
    dependencies[
      "v9helper-babel-plugin-shorthands"
    ] = `^${shorthandsPluginPackageJson.version}`;
  }
  if (dependencies["v9helper-babel-plugin-tokens"]) {
    dependencies[
      "v9helper-babel-plugin-tokens"
    ] = `^${tokensPluginPackageJson.version}`;
  }

  packageJson.dependencies = dependencies;
  return JSON.stringify(packageJson, null, 2);
}

module.exports = { cleanupPackageJson };
