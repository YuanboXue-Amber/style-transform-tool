import { supportedShorthandsKeys, allShorthandsKeys } from "./shorthands";

function splitTemplateLiteral({ path, t }) {
  const expressions = path.get("expressions");
  const quasis = path.get("quasis");
  const result = [];

  let idx = 0;
  let readQuasi = true;
  while (idx < quasis.length) {
    const arg = readQuasi ? quasis[idx] : expressions[idx];

    if (readQuasi) {
      arg.node.value.cooked
        .split(" ")
        .map((token) => token && result.push(t.stringLiteral(token.trim())));
    } else {
      if (arg) {
        result.push(arg.node);
      }
      idx++;
    }

    readQuasi = !readQuasi;
  }
  return result;
}

export const transformShorthandsPlugin = ({ types: t }) => {
  return {
    visitor: {
      CallExpression(path) {
        if (
          t.isIdentifier(path.node.callee) &&
          path.node.callee.name === "makeStyles"
        ) {
          path.traverse({
            ObjectProperty(path) {
              if (t.isIdentifier(path.node.key)) {
                const key = path.get("key");
                const value = path.get("value");
                const keyName = path.node.key.name;

                if (supportedShorthandsKeys.includes(keyName)) {
                  let args = [];
                  if (t.isStringLiteral(value)) {
                    if (keyName === "flex") {
                      args = value.node.value.split(" ").map((token) => {
                        if (!isNaN(token)) {
                          return t.numericLiteral(+token);
                        }
                        return t.stringLiteral(token.trim());
                      });
                    } else {
                      args = value.node.value
                        .split(" ")
                        .map((token) => t.stringLiteral(token.trim()));
                    }
                  } else if (t.isTemplateLiteral(value)) {
                    args = splitTemplateLiteral({ path: value, t });
                  } else {
                    args = [value.node];
                  }

                  path.replaceWith(
                    t.spreadElement(
                      t.callExpression(
                        t.memberExpression(
                          t.identifier("shorthands"),
                          t.identifier(keyName)
                        ),
                        args
                      )
                    )
                  );
                } else if (allShorthandsKeys.includes(keyName)) {
                  if (
                    // `xxx: token.color` -> `xxxColor: token.color`
                    (t.isMemberExpression(value) &&
                      value.toString().indexOf("tokens.color") === 0) ||
                    // `background: yyy` where yyy has no space -> `backgroundColor: yyy`
                    (keyName === "background" &&
                      value.toString().indexOf(" ") < 0)
                  ) {
                    key.replaceWith(t.Identifier(`${key.toString()}Color`));
                  } else {
                    const comment = ` FIXME: ❌ unsupported css property, please manually expand shorthand`;
                    if (
                      !key.node.leadingComments?.some(
                        ({ value }) => value === comment
                      )
                    ) {
                      key.addComment("leading", comment, true);
                    }
                  }
                }
              }
            },
          });
        }
      },
    },
  };
};
