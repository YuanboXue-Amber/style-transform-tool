import * as fs from 'fs';
import shakerEvaluator from '@linaria/shaker';
import { Module } from '@linaria/babel-preset';
import * as JSON5 from 'json5'; // json5 does not add quotes
import { transform } from './transform';
import { getThemeWithStringTokens, getNamespaceTokens } from './siteVariables';

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

// style start -----------

const composeCodeFromMultiSlotStyles = (computedStyles) => {
  let addSlotComments = Object.keys(computedStyles).length > 1;

  let result = `export const useStyles = makeStyles({root: {`;
  Object.entries(computedStyles).forEach(([slotName, styles]) => {
    let stylesStr = JSON5.stringify(styles);
    stylesStr = stylesStr.slice(1, stylesStr.length - 1);
    if (stylesStr) {
      if (addSlotComments) {
        result += `\n// styles from ${slotName} slot (❗️ slots can be different on v9 components)\n`;
      }
      result += stylesStr + ',';
    }
  });
  result += ` } })`;
  return result;
};

// style end -----------
// multi theme -----------

// -----------
// API -----------

export const transformFile = ({
  theme,
  styleFilename,
  exportName,
  variables,
  componentProps,
}) => {
  const exports = getExport(styleFilename, exportName);

  const processedTheme = getThemeWithStringTokens(theme);

  let computedStyles = {};
  Object.keys(exports).forEach((slotName) => {
    const styleF = exports[slotName];
    if (styleF && typeof styleF === 'function') {
      const slotStyle = styleF({
        props: componentProps ?? {},
        theme: processedTheme,
        variables,
      });
      if (Object.keys(slotStyle).length > 0) {
        computedStyles[slotName] = slotStyle;
      }
    }
  });

  return transform(composeCodeFromMultiSlotStyles(computedStyles));
};

export const transformNamespacedFile = ({
  theme,
  styleFilename,
  exportName,
  variable,
  variableProps,
}) => {
  const exports = getExport(styleFilename, exportName);

  const namespacedTokens = getNamespaceTokens(theme);

  let computedStyles = {};
  Object.keys(exports).forEach((slotName) => {
    const styleF = exports[slotName][variable];
    if (styleF && typeof styleF === 'function') {
      namespacedTokens.variableProps = variableProps;
      const slotStyle = styleF(namespacedTokens);
      if (Object.keys(slotStyle).length > 0) {
        computedStyles[slotName] = slotStyle;
      }
    }
  });

  return transform(composeCodeFromMultiSlotStyles(computedStyles));
};
