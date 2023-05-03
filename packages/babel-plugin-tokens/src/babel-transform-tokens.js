import tokenMapping from "./tokenMapping.json";
import { teamsV2Theme } from "@fluentui/react-northstar";

const v0ToV9colors = ({ scheme, token }) =>
  tokenMapping[`${scheme}`]?.[`${token}`];
const v0ToV9fontSize = (size) => tokenMapping.font.size[size];
const v0ToV9fontWeight = (weight) => tokenMapping.font.weight[weight];
const v0ToV9lineHeight = (lineHeight) =>
  tokenMapping.font.lineHeight[lineHeight];

const ALL_SCHEMES = [
  "default",
  "brand",
  "black",
  "white",
  "green",
  "orange",
  "pink",
  "red",
  "yellow",
  "silver",
  "onyx",
  "amethyst",
];

// first check duplicate and then add comment
const addLeadingComment = (path, comment) => {
  if (!path.node.leadingComments?.some(({ value }) => value === comment)) {
    path.addComment("leading", comment, true);
  }
};

const addFixMe = (t, path, comment) => {
  let parent = path.parentPath;
  while (parent && !t.isObjectProperty(parent)) {
    parent = parent.parentPath;
  }
  if (parent) {
    addLeadingComment(
      parent,
      comment ?? ` FIXME: ❌ No v9 matching found for token ${path.toString()}`
    );
  }
};

const transformColorToken = (t, path) => {
  const key = path.get("object");
  const value = path.get("property");
  if (value.toString() === "black" || value.toString() === "white") {
    addFixMe(
      t,
      path,
      ` FIXME: ❌ color ${value.toString()} detected; Consider replacing with token in https://react.fluentui.dev/?path=/docs/theme-color--page`
    );
    return;
  }

  if (t.isIdentifier(key) && t.isIdentifier(value)) {
    // may be color token
    const scheme = ALL_SCHEMES.find((schemeName) =>
      key.node.name.toLowerCase().includes(schemeName)
    );
    if (scheme) {
      const token = value.node.name;
      const v9token = v0ToV9colors({ scheme, token });
      if (v9token) {
        path.replaceWith(
          t.memberExpression(t.identifier("tokens"), t.identifier(v9token))
        );
      } else {
        addFixMe(t, path);
      }
    }
  } else if (t.isLiteral(value)) {
    // may be single color
    const colorGroup = key.toString().split(".").pop();
    const valueStr = value.toString();
    const colorNumber = valueStr.startsWith('"')
      ? valueStr.slice(1, valueStr.length - 1)
      : valueStr;
    const colorHex =
      teamsV2Theme.siteVariables.colors[colorGroup]?.[colorNumber];
    if (colorHex) {
      let parent = path.parentPath;
      while (parent && !t.isObjectProperty(parent)) {
        parent = parent.parentPath;
      }
      if (parent) {
        addLeadingComment(
          parent,
          ` You can locate a token in https://react.fluentui.dev/?path=/docs/theme-color--page`
        );
        addLeadingComment(
          parent,
          ` FIXME: ⚠️ No v9 matching found for token ${path.toString()}, its value is \`${colorHex}\``
        );
      }
    } else {
      addFixMe(t, path);
    }
  }
};

const transfromFont = (t, path) => {
  const keyName = path.get("key").toString();
  const value = path.get("value");
  const valueName = value.toString();

  const transform = (v0Token, v0ToV9Func) => {
    const v9token = v0ToV9Func(v0Token);
    if (v9token) {
      value.replaceWith(
        t.memberExpression(t.identifier("tokens"), t.identifier(v9token))
      );
    } else {
      addFixMe(t, value);
    }
  };

  if (
    keyName === "fontSize" &&
    (valueName.includes("fontSizes") ||
      Object.keys(tokenMapping.font.size).some((v) => valueName.includes(v)))
  ) {
    const v0Token = valueName.split(".").pop();
    transform(v0Token, v0ToV9fontSize);
    if (v0Token === "large") {
      addFixMe(
        t,
        value,
        ` Warning: please notice v0 'large' is 18px; it maps to v9 fontSizeBase400 (16px) or fontSizeBase500 (20px)`
      );
    }
    return;
  }

  if (keyName === "fontWeight" && valueName.includes("fontWeight")) {
    const v0Token = valueName.slice(10).toLowerCase();
    if (valueName === "fontWeightSemilight") {
      value.replaceWith(t.stringLiteral("300"));
    } else if (valueName === "fontWeightLight") {
      value.replaceWith(t.stringLiteral("200"));
    } else {
      transform(v0Token, v0ToV9fontWeight);
    }
    return;
  }

  if (keyName === "lineHeight" && valueName.includes("lineHeight")) {
    const v0Token = valueName.slice(10).toLowerCase();
    transform(v0Token, v0ToV9lineHeight);
    return;
  }
};

// transform token + add FIXME comment in conditional expression
export const transformTokensPlugin = ({ types: t }) => ({
  visitor: {
    CallExpression(path) {
      if (
        t.isIdentifier(path.node.callee) &&
        path.node.callee.name === "makeStyles"
      ) {
        path.traverse({
          ObjectProperty(path) {
            transfromFont(t, path);

            path.traverse({
              MemberExpression(path) {
                transformColorToken(t, path);
              },
            });
          },
        });
      }
    },
  },
});
