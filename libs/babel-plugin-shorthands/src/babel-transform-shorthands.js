import { supportedShorthandsKeys, allShorthandsKeys } from './shorthands';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';

export const transformShorthandsPlugin = ({ types: t }) => {
  return {
    visitor: {
      ObjectProperty(path) {
        if (t.isIdentifier(path.node.key)) {
          const key = path.get('key');
          const value = path.get('value');
          const keyName = path.node.key.name;

          if (supportedShorthandsKeys.includes(keyName)) {
            let newSource;
            if (t.isStringLiteral(value)) {
              newSource = `...shorthands.${keyName}(${value.node.value
                .split(' ')
                .map((token) => `"${token.trim()}"`)
                .join(', ')})`;
            } else if (t.isTemplateLiteral(value)) {
              const currSource = value.toString();
              const currSourceWithoutQuotes = currSource.slice(
                1,
                currSource.length - 1
              );
              newSource = `...shorthands.${keyName}(${currSourceWithoutQuotes
                .split(' ')
                .map((token) => {
                  const trimmed = token.trim();
                  if (trimmed[0] === '$') {
                    return trimmed.slice(2, trimmed.length - 1);
                  }
                  return `"${trimmed}"`;
                })
                .join(', ')})`;
            } else {
              newSource = `...shorthands.${keyName}(${value.toString()})`;
            }

            const ast = parser.parse(`const a = { ${newSource} } `);
            traverse(ast, {
              SpreadElement(newPath) {
                path.replaceWith(newPath);
              },
            });
          } else if (allShorthandsKeys.includes(keyName)) {
            if (
              t.isMemberExpression(value) &&
              value.toString().indexOf('tokens.color') === 0
            ) {
              // `xxx: token.color` -> `xxxColor: token.color`
              key.replaceWithSourceString(`${key.toString()}Color`);
            } else if (
              keyName === 'background' &&
              value.toString().indexOf(' ') < 0
            ) {
              // `background: yyy` where yyy has no space -> `backgroundColor: yyy`
              key.replaceWithSourceString(`${key.toString()}Color`);
            } else {
              key.addComment(
                'leading',
                ` FIXME: ❌ unsupported css property, please manually expand shorthand`,
                true
              );
            }
          }
        }
      },
    },
  };
};
