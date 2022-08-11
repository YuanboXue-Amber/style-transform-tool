import * as Babel from '@babel/standalone';
import { hasToken, tokensV0toV9 } from './transformToken';
import {
  transformShorthandsHelper,
  transformShorthandsPlugin,
} from 'v9helper-babel-plugin-shorthands';

const transformTokenPlugin = () => {
  return {
    visitor: {
      StringLiteral(path) {
        if (path.node.value && hasToken(path.node.value)) {
          const replacementResult = tokensV0toV9(path.node.value);
          path.replaceWithSourceString(replacementResult.value);

          if (replacementResult.comments.length) {
            // found token without matching in v9, add comments for them
            replacementResult.comments.reverse().forEach((comment) => {
              path.parentPath.addComment('leading', comment, true);
            });
          }
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
