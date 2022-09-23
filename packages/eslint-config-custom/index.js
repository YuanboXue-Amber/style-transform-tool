module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "turbo",
    "prettier",
  ],
  env: {
    "jest/globals": true,
    browser: true,
    node: true,
  },
  plugins: ["@typescript-eslint", "import", "jest"],
  parser: "@typescript-eslint/parser",
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "import/no-extraneous-dependencies": [
      "error",
      { devDependencies: ["**/*.spec.*", "**/*.config.js"] },
    ],
  },
  overrides: [
    {
      files: ["*.config.js", "postbuild.js"],
      rules: { "@typescript-eslint/no-var-requires": "off" },
    },
  ],
};
