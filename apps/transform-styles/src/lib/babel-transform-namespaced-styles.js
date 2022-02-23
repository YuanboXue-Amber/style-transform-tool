import template from "@babel/template";
import { v0ToV9 } from "../tokenMapping/getColorToken.js";

// eslint-disable-next-line import/no-anonymous-default-export
export default function ({ types: t }) {
  return {
    visitor: {
      Program(path) {
        path.unshiftContainer(
          "body",
          template.statement.ast(
            `import { makeStyles, tokens, shorthands } from "@msteams/components-teams-fluent-ui";`
          )
        );
      },
      ExportDefaultDeclaration(path, { opts: { userVariables } }) {
        t.assertTSAsExpression(path.node.declaration);
        t.assertObjectExpression(path.node.declaration.expression);

        const slots = path
          .get("declaration")
          .get("expression")
          .get("properties");

        // TODO figure out a nice way to add new line before
        let resultMakeStylesSource = ` 
          //
          // converted makeStyles hook
          export const useStyles = makeStyles({
        `;

        slots.forEach((slot) => {
          const slotName = slot.node.key.name;

          let slotStylesString = "";

          const variableProperties = slot.get("value").get("properties");
          variableProperties.forEach((variableProperty) => {
            const currVariable = variableProperty.node.key.name;

            if (userVariables.includes(currVariable)) {
              const styleFunction = variableProperty.get("value");

              let stylesSource = getStylesSource({
                t,
                stylesFunctionBody: styleFunction.get("body"),
              });
              stylesSource = replaceTokenWithFullPath({
                styleFunction,
                t,
                stylesSource,
              });

              slotStylesString =
                slotStylesString +
                `\n// styles from ${currVariable}
                ${stylesSource.trim()}
                `;
            }
          });

          slotStylesString = slotStylesString.trim().length
            ? `\n${slotName}: {\n` + slotStylesString + "\n},"
            : "";
          resultMakeStylesSource += slotStylesString;
        });

        resultMakeStylesSource = resultMakeStylesSource + "\n});";

        const makeStylesNode = template.statement.ast(resultMakeStylesSource, {
          preserveComments: true,
        });
        path.replaceWith(makeStylesNode);

        // replace v0 token with v9 token
        path.traverse({
          MemberExpression(path) {
            if (
              path.node.object.name &&
              path.node.object.name.indexOf("colorScheme") === 0
            ) {
              const scheme = path.node.object.name
                .slice("colorScheme".length)
                .toLowerCase();
              const token = path.node.property.name;
              const v9Token = v0ToV9({ scheme, token });
              v9Token && path.replaceWithSourceString(`tokens.${v9Token}`);
            }
          },
        });

        // path.insertBefore(t.expressionStatement(t.stringLiteral(``)));
      },
    },
  };
}

const getStylesSource = ({ t, stylesFunctionBody }) => {
  let stylesSource = "";

  if (t.isBlockStatement(stylesFunctionBody.node)) {
    stylesFunctionBody.traverse({
      ReturnStatement(path) {
        stylesSource = path.get("argument").getSource();
      },
    });
  } else if (t.isObjectExpression(stylesFunctionBody.node)) {
    stylesSource = stylesFunctionBody.getSource();
  }

  if (
    stylesSource[0] === "{" &&
    stylesSource[stylesSource.length - 1] === "}"
  ) {
    stylesSource = stylesSource.slice(1, stylesSource.length - 1);
  }

  return stylesSource;
};

// replace tokens like `foregroundActive` into `colorSchemeBrand.foregroundActive`
const replaceTokenWithFullPath = ({ t, styleFunction, stylesSource }) => {
  const styleFunctionParam = styleFunction.get("params")[0];

  const bindings = styleFunction.scope.bindings;

  for (const bindingValue of Object.values(bindings)) {
    const bindingIdentifier = bindingValue.identifier;
    let variableName = bindingIdentifier.name;

    // find
    styleFunctionParam.traverse({
      Identifier(path) {
        if (path.node === bindingIdentifier) {
          let parentPath = path.parentPath.parentPath;
          while (parentPath !== styleFunction) {
            if (t.isObjectProperty(parentPath)) {
              variableName = `${parentPath.node.key.name}.${variableName}`;
            }
            parentPath = parentPath.parentPath;
          }
        }
      },
    });

    // replace all usage of this token
    if (variableName !== bindingIdentifier.name) {
      // const referencePaths = bindingValue.referencePaths;
      // referencePaths.forEach((referencePath) => {
      //   referencePath.replaceWithSourceString(variableName);
      // });

      // string replace -> not the best, but not the worst
      stylesSource = stylesSource.replace(
        new RegExp(bindingIdentifier.name, "g"),
        variableName
      );
    }
  }

  return stylesSource;
};
