import * as Babel from "@babel/standalone";
import { transformShorthandsPlugin } from "v9helper-babel-plugin-shorthands";
import { transformTokensPlugin } from "v9helper-babel-plugin-tokens";

// add FIXME comment in conditional expression
export const checkForConditionalExpressionPlugin = ({ types: t }) => {
  return {
    visitor: {
      CallExpression(path) {
        if (
          t.isIdentifier(path.node.callee) &&
          path.node.callee.name === "makeStyles"
        ) {
          path.traverse({
            ConditionalExpression(path) {
              let parent = path.parentPath;
              while (parent && !t.isObjectProperty(parent)) {
                parent = parent.parentPath;
              }
              if (parent) {
                const comment = ` FIXME: ❌ Conditional expression detected. Only static values are allowed in makeStyles; please create separate slots for each condition and apply them using \`mergeClasses\``;
                if (
                  !parent.node.leadingComments?.some(
                    ({ value }) => value === comment
                  )
                ) {
                  parent.addComment("leading", comment, true);
                }
              }
            },
          });
        }
      },
    },
  };
};

const transformShorthandsInStyleObject = (code) => {
  try {
    const resultFromBabel = Babel.transform(
      `export const useStyles = makeStyles({special_root: \n ${code}})`,
      {
        presets: [
          [Babel.availablePresets["typescript"], { allExtensions: true }],
        ],
        filename: "file.js",
        plugins: [
          [checkForConditionalExpressionPlugin],
          [transformTokensPlugin],
          [transformShorthandsPlugin],
        ],
      }
    );

    const extractStyleObject =
      resultFromBabel.code &&
      resultFromBabel.code.slice(
        resultFromBabel.code.indexOf("special_root:") + "special_root:".length,
        resultFromBabel.code.length - 3
      );
    return extractStyleObject ?? code;
  } catch (error) {
    console.warn("Transform style object error:", error);
    return code;
  }
};

const isUserCodeObject = (userCode) => {
  userCode = removeCommentsFromStyleObject(userCode);

  if (userCode[0] === "{" && userCode[userCode.length - 1] === "}") {
    return true;
  }
  return false;
};

const removeCommentsFromStyleObject = (userCode) =>
  userCode
    .split("\n")
    .filter((line) => !line.trim().startsWith("//"))
    .join("\n")
    .trim();

export function transformStylesObject(userCode) {
  if (isUserCodeObject(userCode)) {
    return transformShorthandsInStyleObject(userCode);
  }
  return userCode;
}
