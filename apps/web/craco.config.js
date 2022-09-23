const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const TsConfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");

module.exports = {
  webpack: {
    configure: (config) => {
      // https://nx.dev/recipe/migration-cra

      // Remove guard against importing modules outside of \`src\`.
      // Needed for workspace projects.
      config.resolve.plugins = config.resolve.plugins.filter(
        (plugin) => !(plugin instanceof ModuleScopePlugin)
      );

      // Add support for importing workspace projects.
      config.resolve.plugins.push(
        new TsConfigPathsPlugin({
          configFile: path.resolve(
            __dirname,
            "../../packages/tsconfig/base.json"
          ),
          extensions: [".ts", ".tsx", ".js", ".jsx"],
          mainFields: ["module", "main"],
        })
      );

      // Replace include option for babel loader with exclude
      // so babel will handle workspace projects as well.
      config.module.rules[1].oneOf.forEach((r) => {
        if (r.loader && r.loader.indexOf("babel") !== -1) {
          r.exclude = /node_modules/;
          delete r.include;
        }
      });

      return config;
    },
    plugins: [
      new NodePolyfillPlugin({
        excludeAliases: [
          "console",
          "domain",
          "events",
          "http",
          "https",
          "punycode",
          "querystring",
          "_stream_duplex",
          "_stream_passthrough",
          "_stream_transform",
          "_stream_writable",
          "string_decoder",
          "sys",
          "timers",
          "tty",
          "url",
          "util",
          "zlib",
          //
          "assert",
          "buffer",
          "constants",
          "crypto",
          "os",
          "path",
          "stream",
          "vm",
        ],
      }),
    ],
  },
  jest: {
    watchPlugins: [
      "jest-watch-typeahead/filename",
      "jest-watch-typeahead/testname",
    ],
  },
};
