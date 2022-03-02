import * as Babel from '@babel/standalone';
import { hasToken, tokensV0toV9 } from './siteVariables';
import {
  transformShorthandsHelper,
  transformShorthandsPlugin,
} from '../babel-plugin-shorthands';

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

export const transform = (sourceCode) => {
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
