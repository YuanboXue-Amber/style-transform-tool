const fs = require('fs');
import shakerEvaluator from '@linaria/shaker';
import { Module } from '@linaria/babel-preset';
import * as Babel from '@babel/standalone';
import * as JSON5 from 'json5'; // json5 does not add quotes
import {
  transformShorthandsHelper,
  transformShorthandsPlugin,
} from '../babel-plugin';
import { hasToken, processedLightTheme } from './replace-siteVariables';

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

// style -----------
const transformTokenPlugin = () => {
  const replaceColorToken = (str) =>
    `\`${str
      .split(' ')
      // TODO get the real token instead of token.amberTemp
      .map((word) => (hasToken(word) ? `$\{token.amberTemp}` : word))
      .join(' ')}\``;

  return {
    visitor: {
      StringLiteral(path) {
        if (path.node.value && hasToken(path.node.value)) {
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

export const transformFile = (styleFilename, variables) => {
  const styleCode = fs.readFileSync(styleFilename, 'utf8');

  const mod = new Module(styleFilename, linariaOptions);
  mod.evaluate(styleCode, ['sliderStyles']);

  // TODO: I'm using only root slot here
  const styleF = mod.exports.sliderStyles.root; // TODO: get theme from TMP, or at least all siteVariables
  const processedTheme = processedLightTheme; // TODO: other theme

  const computedStyles = styleF({
    theme: processedTheme,
    variables,
  });
  const computedStylesCode = `export const useStyles = makeStyles({root: ${JSON5.stringify(
    computedStyles
  )} })`;

  return transformCode(computedStylesCode);
};
