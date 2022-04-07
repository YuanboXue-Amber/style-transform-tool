import * as fs from 'fs';
import shakerEvaluator from '@linaria/shaker';
import { Module, Evaluator } from '@linaria/babel-preset';
import {
  getAllThemesStylesFiles,
  getCurrentTMPtheme,
  composeV9stylesCode,
  getTMPsiteVariables,
  findGitRoot,
  tmpThemes,
} from './multi-themes';
import { transform } from './transform';
import {
  replaceSiteVariblesToString,
  makeNamespaceParms,
} from './transformToken';
import * as babelTSpresets from '@babel/preset-typescript';
import {
  ComputeOneTheme,
  ComputeStylesFromFile,
  Main,
  ThemeName,
} from './types';

// const hrToSeconds = (hrtime) => {
//   const raw = hrtime[0] + hrtime[1] / 1e9;
//   return raw.toFixed(2) + 's';
// };

// linaria get styles start ---------
const theme_namespace_helper_Evaluator: Evaluator = (
  _filename,
  _options,
  _text,
  _only
) => {
  return [
    `"use strict";

Object.defineProperty(exports, "__esModule", {
value: true
});
exports.getOverrideFn = void 0;

var getOverrideFn = function getOverrideFn() {
return function () {};
};

exports.getOverrideFn = getOverrideFn;`,
    null,
  ];
};
const linariaOptions = {
  displayName: false,
  evaluate: true,
  rules: [
    { action: shakerEvaluator },
    {
      test: /[/\\]node_modules[/\\]/,
      action: 'ignore',
    },
    {
      test: /[/\\]theme-namespace-helper/,
      action: theme_namespace_helper_Evaluator,
    },
  ],
  babelOptions: {
    configFile: false,
    babelrc: false,
    presets: [babelTSpresets],
  },
};

const getExport = (styleFilename, exportName) => {
  const styleCode = fs.readFileSync(styleFilename, 'utf8');
  const mod = new Module(styleFilename, linariaOptions);
  mod.evaluate(styleCode, [exportName]);
  return mod.exports[exportName];
};

const computeStyles =
  ({ themeWithStringTokens, variables, componentProps }) =>
  ({ computedStyles, themeName, slotName, exports }) => {
    const styleF = exports[slotName];

    if (styleF && typeof styleF === 'function') {
      const slotStyle = styleF({
        props: componentProps ?? {},
        theme: themeWithStringTokens,
        variables,
      });

      if (Object.keys(slotStyle).length > 0) {
        computedStyles[slotName] = computedStyles[slotName] ?? {};
        computedStyles[slotName][themeName] = slotStyle;
      }
    }
  };
const computedNamespacedStyles =
  ({ namespaceParmsWithStringTokens, variable, variableProps }) =>
  ({ computedStyles, themeName, slotName, exports }) => {
    const styleF = exports[slotName][variable];

    if (styleF && typeof styleF === 'function') {
      namespaceParmsWithStringTokens.variableProps = variableProps;
      const slotStyle = styleF(namespaceParmsWithStringTokens);

      if (Object.keys(slotStyle).length > 0) {
        computedStyles[slotName] = computedStyles[slotName] ?? {};
        computedStyles[slotName][themeName] = slotStyle;
      }
    }
  };
// linaria get styles end ---------

// multi-theme handling start ---------

// Compute styles and assign to computedStyles[slotName][themeName]
const computeStylesForOneTheme: ComputeOneTheme =
  ({ gitRoot, themeName, currentThemeStylesFile, exportName }) =>
  ({
    isNamespaced,
    // namespaced
    variableProps,
    // non-namespaced
    variables,
    componentProps,
  }) =>
  (computedStyles) => {
    // let startT = process.hrtime();
    const tmpTheme = {
      siteVariables: getTMPsiteVariables({ gitRoot, themeName }) ?? {},
    };
    // console.log(
    //   'computeStylesForOneTheme',
    //   'getTMPsiteVariables',
    //   hrToSeconds(process.hrtime(startT))
    // );

    const themeWithStringTokens = replaceSiteVariblesToString(tmpTheme);

    const currentThemeStylesFileExports = getExport(
      currentThemeStylesFile,
      exportName
    );

    const computeFunc = isNamespaced
      ? computedNamespacedStyles({
          namespaceParmsWithStringTokens: makeNamespaceParms(
            themeWithStringTokens
          ),
          variable: Object.keys(variables)?.[0],
          variableProps,
        })
      : computeStyles({
          themeWithStringTokens,
          variables,
          componentProps,
        });
    Object.keys(currentThemeStylesFileExports).forEach((slotName) => {
      computeFunc({
        computedStyles,
        themeName,
        slotName,
        exports: currentThemeStylesFileExports,
      });
    });
  };

const computeAllThemes: ComputeStylesFromFile =
  ({ gitRoot, inputFilename, exportName }) =>
  ({
    isNamespaced,
    // namespaced
    variableProps,
    // non-namespaced
    variables,
    componentProps,
  }) => {
    // get style files in all themes
    const allThemesStylesFiles = getAllThemesStylesFiles({
      gitRoot,
      filename: inputFilename,
    });

    // compute all styles
    const computedStyles = {};

    Object.keys(allThemesStylesFiles).forEach((themeName) => {
      const currentThemeStylesFile = allThemesStylesFiles[themeName];
      if (!currentThemeStylesFile) {
        return;
      }

      computeStylesForOneTheme({
        gitRoot,
        themeName: themeName as ThemeName,
        currentThemeStylesFile,
        exportName,
      })({
        isNamespaced,
        // namespaced
        variableProps,
        // non-namespaced
        variables,
        componentProps,
      })(computedStyles);
    });

    return computedStyles;
  };

const computeCurrentTheme: ComputeStylesFromFile =
  ({ gitRoot, inputFilename, exportName }) =>
  ({
    isNamespaced,
    // namespaced
    variableProps,
    // non-namespaced
    variables,
    componentProps,
  }) => {
    // guess current theme
    const themeName = getCurrentTMPtheme(inputFilename);
    if (tmpThemes[themeName] === undefined) {
      throw new Error(`Detect the current theme is ${themeName}, which is not a valid TMP theme.
  The value must be one of: teams, teams-tfl, teams-v2, teams-dark, teams-dark-tfl, teams-dark-v2, teams-hight-contrast`);
    }

    // compute styles
    const computedStyles = {};

    computeStylesForOneTheme({
      gitRoot,
      themeName: themeName as ThemeName,
      currentThemeStylesFile: inputFilename,
      exportName,
    })({
      isNamespaced,
      // namespaced
      variableProps,
      // non-namespaced
      variables,
      componentProps,
    })(computedStyles);

    return computedStyles;
  };

// multi-theme handling end ---------

export const main: Main =
  ({ inputFilename, exportName, isTransformAllThemes }) =>
  ({
    isNamespaced,
    // namespaced
    variableProps,
    // non-namespaced
    variables,
    componentProps,
  }) => {
    // find git root
    const gitRoot = findGitRoot(inputFilename);
    if (!gitRoot) {
      throw new Error(
        `unable to find workspace root from specified file name ${inputFilename}`
      );
    }

    const computeStylesFunc = isTransformAllThemes
      ? computeAllThemes
      : computeCurrentTheme;

    const computedStylesObject = computeStylesFunc({
      gitRoot,
      inputFilename,
      exportName,
    })({
      isNamespaced,
      // namespaced
      variableProps,
      // non-namespaced
      variables,
      componentProps,
    });

    const v9StylesCode = composeV9stylesCode(computedStylesObject);
    const result = transform(v9StylesCode);

    return result;
  };
