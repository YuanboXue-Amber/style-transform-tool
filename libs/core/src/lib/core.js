import * as fs from 'fs';
import shakerEvaluator from '@linaria/shaker';
import { Module } from '@linaria/babel-preset';
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

// linaria get styles start ---------
const linariaOptions = {
  displayName: false,
  evaluate: true,
  rules: [
    { action: shakerEvaluator },
    {
      test: /[/\\]node_modules[/\\]/,
      action: 'ignore',
    },
  ],
  babelOptions: {
    configFile: false,
    babelrc: false,
    presets: ['@babel/typescript'],
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
const computeStylesForOneTheme =
  ({ gitRoot, themeName, currentThemeStylesFile, exportName }) =>
  ({
    isNamespaced,
    // namespaced
    variable,
    variableProps,
    // non-namespaced
    variables,
    componentProps,
  }) =>
  (computedStyles) => {
    const themeWithStringTokens = replaceSiteVariblesToString({
      siteVariables: getTMPsiteVariables({ gitRoot, themeName }) ?? {},
    });

    const currentThemeStylesFileExports = getExport(
      currentThemeStylesFile,
      exportName
    );

    Object.keys(currentThemeStylesFileExports).forEach((slotName) => {
      const computeFunc = isNamespaced
        ? computedNamespacedStyles({
            namespaceParmsWithStringTokens: makeNamespaceParms(
              themeWithStringTokens
            ),
            variable,
            variableProps,
          })
        : computeStyles({
            themeWithStringTokens,
            variables,
            componentProps,
          });
      computeFunc({
        computedStyles,
        themeName,
        slotName,
        exports: currentThemeStylesFileExports,
      });
    });
  };

const computeAllThemes =
  ({ gitRoot, inputFilename, exportName }) =>
  ({
    isNamespaced,
    // namespaced
    variable,
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
        themeName,
        currentThemeStylesFile,
        exportName,
      })({
        isNamespaced,
        // namespaced
        variable,
        variableProps,
        // non-namespaced
        variables,
        componentProps,
      })(computedStyles);
    });

    return computedStyles;
  };

const computeCurrentTheme =
  ({ gitRoot, inputFilename, exportName }) =>
  ({
    isNamespaced,
    // namespaced
    variable,
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
      themeName,
      currentThemeStylesFile: inputFilename,
      exportName,
    })({
      isNamespaced,
      // namespaced
      variable,
      variableProps,
      // non-namespaced
      variables,
      componentProps,
    })(computedStyles);

    return computedStyles;
  };

// multi-theme handling end ---------

export const main =
  ({ inputFilename, exportName, isTransformAllThemes }) =>
  ({
    isNamespaced,
    // namespaced
    variable,
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
      variable,
      variableProps,
      // non-namespaced
      variables,
      componentProps,
    });

    const v9StylesCode = composeV9stylesCode(computedStylesObject);
    return transform(v9StylesCode);
  };
