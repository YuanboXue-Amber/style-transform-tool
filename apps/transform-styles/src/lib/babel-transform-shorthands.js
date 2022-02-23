import { showthandsKeywordForEasyReplace } from "./shorthandsWorkaround.js";
import template from "@babel/template";

// eslint-disable-next-line import/no-anonymous-default-export
export default function ({ types: t }) {
  return {
    visitor: {
      ExportNamedDeclaration(
        path,
        { opts: { supportedShorthandsKeys, allShorthandsKeys } }
      ) {
        t.assertVariableDeclaration(path.node.declaration);
        t.assertVariableDeclarator(path.node.declaration.declarations[0]);
        path.traverse({
          ObjectProperty(path) {
            if (t.isIdentifier(path.node.key)) {
              const key = path.get("key");
              const value = path.get("value");
              const keyName = path.node.key.name;

              if (supportedShorthandsKeys.includes(keyName)) {
                let newSource;
                if (t.isStringLiteral(value)) {
                  newSource = `${showthandsKeywordForEasyReplace}.${keyName}(${value.node.value
                    .split(" ")
                    .map((token) => `"${token.trim()}"`)
                    .join(", ")})`;
                } else if (t.isMemberExpression(value)) {
                  newSource = `${showthandsKeywordForEasyReplace}.${keyName}(${value.toString()})`;
                } else if (t.isTemplateLiteral(value)) {
                  const currSource = value.toString();
                  const currSourceWithoutQuotes = currSource.slice(
                    1,
                    currSource.length - 1
                  );
                  newSource = `${showthandsKeywordForEasyReplace}.${keyName}(${currSourceWithoutQuotes
                    .split(" ")
                    .map((token) =>
                      token.trim()[0] === "$"
                        ? `\`${token.trim()}\``
                        : `"${token.trim()}"`
                    )
                    .join(", ")})`;
                }

                newSource && path.replaceWithSourceString(newSource);
              } else if (allShorthandsKeys.includes(keyName)) {
                if (
                  t.isMemberExpression(value) &&
                  value.toString().indexOf("tokens.color") === 0
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
}
