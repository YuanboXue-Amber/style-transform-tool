const fs = require('fs');

import shakerEvaluator from '@linaria/shaker';
const Module = require('@linaria/babel-preset').Module;
const Babel = require('@babel/standalone');
const { teamsV2Theme } = require('@fluentui/react-northstar');
const JSON5 = require('json5');
const {
  transformShorthandsHelper,
  transformShorthandsPlugin,
} = require('../babel-plugin/babel-transform-shorthands');

// recursively iterate thru an object, replace the value into key_value string
const valueToString = (object, result, prefix = '') => {
  Object.entries(object).forEach(([key, value]) => {
    result[key] = result[key] ?? {};
    if (typeof value === 'object') {
      valueToString(value, result[key], `${prefix}_${key}`);
    } else {
      result[key] = `${prefix}_${key}_${value}`;
    }
  });
};

// replace a theme's color token into string
const getProcessedTheme = (theme) => {
  const procssedSiteVariables = {};
  valueToString(theme?.siteVariables, procssedSiteVariables, 'siteVariables');
  return {
    ...theme,
    siteVariables: procssedSiteVariables,
  };
};

const hasProcessedToken = (str) =>
  str.indexOf('siteVariables_colorScheme_') >= 0;

// linaria start

const options = {
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

// style -----------
const transformTokenPlugin = () => {
  const replaceColorToken = (str) =>
    `\`${str
      .split(' ')
      // TODO get the real token instead of token.amberTemp
      .map((word) => (hasProcessedToken(word) ? `$\{token.amberTemp}` : word))
      .join(' ')}\``;

  return {
    visitor: {
      StringLiteral(path) {
        if (path.node.value && hasProcessedToken(path.node.value)) {
          path.replaceWithSourceString(replaceColorToken(path.node.value));
        }
      },
    },
  };
};

export const transformCode = (sourceCode) => {
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

export const transformFile = (styleFilename) => {
  const styleCode = fs.readFileSync(styleFilename, 'utf8');

  const mod = new Module(styleFilename, options);
  mod.evaluate(styleCode, ['sliderStyles']);

  // TODO: I'm using only root slot here
  const styleF = mod.exports.sliderStyles.root; // TODO: get theme from TMP, or at least all siteVariables
  const processedTheme = getProcessedTheme(teamsV2Theme);

  const computedStyles = styleF({
    theme: processedTheme,
    variables: {
      isCallingVolumeSliderDisabled: true,
      isCallingPreJoinV2ComputerAudioVolumeSlider: true,
    },
  });
  const computedStylesCode = `export const useStyles = makeStyles({root: ${JSON5.stringify(
    computedStyles
  )} })`;

  return transformCode(computedStylesCode);
};

// ----

// wrapInMakeStyles(expandShorthand(replaceToken(computedStyles)));

// theme -----------

// const fileName = path.resolve(
//   __dirname,
//   "packages/components/components-teams-stardust-ui/src/components/ui-provider.tsx"
// );
// const code = fs.readFileSync(fileName, "utf8");

// const mod = new Module(fileName, options);
// mod.evaluate(code, ["getThemesObject"]);

// console.log("mod.exports", mod.exports);

// const themeF = mod.exports.getThemesObject;
// console.log(JSON.stringify(themeF("defaultV2")));

// -----------------
