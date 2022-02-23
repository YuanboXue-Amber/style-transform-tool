import template from '@babel/template';
import { supportedShorthandsKeys, allShorthandsKeys } from './shorthands';
import { SHORTHANDS_KEYWORD_FOR_EASY_REPLACE } from './helper';

export const transformShorthandsPlugin = ({ types: t }: any) => {
  return {
    visitor: {
      ExportNamedDeclaration(path: any) {
        t.assertVariableDeclaration(path.node.declaration);
        t.assertVariableDeclarator(path.node.declaration.declarations[0]);
        path.traverse({
          ObjectProperty(path: any) {
            if (t.isIdentifier(path.node.key)) {
              const key = path.get('key');
              const value = path.get('value');
              const keyName = path.node.key.name;

              if (supportedShorthandsKeys.includes(keyName)) {
                let newSource;
                if (t.isStringLiteral(value)) {
                  newSource = `${SHORTHANDS_KEYWORD_FOR_EASY_REPLACE}.${keyName}(${value.node.value
                    .split(' ')
                    .map((token: string) => `"${token.trim()}"`)
                    .join(', ')})`;
                } else if (t.isMemberExpression(value)) {
                  newSource = `${SHORTHANDS_KEYWORD_FOR_EASY_REPLACE}.${keyName}(${value.toString()})`;
                } else if (t.isTemplateLiteral(value)) {
                  const currSource = value.toString();
                  const currSourceWithoutQuotes = currSource.slice(
                    1,
                    currSource.length - 1
                  );
                  newSource = `${SHORTHANDS_KEYWORD_FOR_EASY_REPLACE}.${keyName}(${currSourceWithoutQuotes
                    .split(' ')
                    .map((token: string) =>
                      token.trim()[0] === '$'
                        ? `\`${token.trim()}\``
                        : `"${token.trim()}"`
                    )
                    .join(', ')})`;
                }

                newSource && path.replaceWithSourceString(newSource);
              } else if (allShorthandsKeys.includes(keyName)) {
                if (
                  t.isMemberExpression(value) &&
                  value.toString().indexOf('tokens.color') === 0
                ) {
                  key.replaceWithSourceString(`${key.toString()}Color`);
                } else {
                  key.replaceWith(
                    template.expression.ast(
                      `// ❌ unsupported css property, please manually expand shorthand\n${key.toString()}`,
                      {
                        preserveComments: true,
                      }
                    )
                  );
                }
              }
            }
          },
        });
      },
    },
  };
};
