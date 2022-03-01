import * as fs from 'fs';
import shakerEvaluator from '@linaria/shaker';
import { Module } from '@linaria/babel-preset';
import * as Babel from '@babel/standalone';
import * as JSON5 from 'json5'; // json5 does not add quotes
import {
  transformShorthandsHelper,
  transformShorthandsPlugin,
} from '../babel-plugin';
import {
  hasToken,
  tokensV0toV9,
  getThemeWithStringTokens,
  getNamespaceTokens,
} from './siteVariables';

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

// style -----------

const transformTokenPlugin = () => {
  return {
    visitor: {
      StringLiteral(path) {
        if (path.node.value && hasToken(path.node.value)) {
          path.replaceWithSourceString(tokensV0toV9(path.node.value));
        }
      },
    },
  };
};

const transformTokenShorthands = (sourceCode) => {
  const babelFileResult = Babel.transform(sourceCode, {
    babelrc: false,
    configFile: false,
    plugins: [[transformTokenPlugin], [transformShorthandsPlugin]],
  });

  if (babelFileResult === null) {
    throw new Error(`Failed to transform due to unknown Babel error...`);
  }

  return transformShorthandsHelper(babelFileResult.code);
};

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

  return transformTokenShorthands(
    composeCodeFromMultiSlotStyles(computedStyles)
  );
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

  return transformTokenShorthands(
    composeCodeFromMultiSlotStyles(computedStyles)
  );
};

// const styleFilename =
//   '/Users/yuanboxue/dev/TMP/t2/teams-modular-packages/packages/components/components-teams-stardust-ui/src/themes/teams/components/Slider/slider-styles.ts';

// console.log(
//   transformFile(styleFilename, 'sliderStyles', {
//     isCallingVolumeSliderDisabled: true,
//     isCallingPreJoinV2ComputerAudioVolumeSlider: true,
//   })
// );

// const styleFilename =
//   '/Users/yuanboxue/dev/TMP/t2/teams-modular-packages/packages/components/components-teams-stardust-ui/src/themes/teams/components/Card/card-namespace-edu.ts';

// console.log(
//   transformFile(styleFilename, 'default', {
//     gridViewTeamCard: true,
//   })
// );
