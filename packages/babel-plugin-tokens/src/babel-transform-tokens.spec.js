import * as Babel from "@babel/core";
import { transformTokensPlugin } from "./babel-transform-tokens";

describe("transformStyleObject", () => {
  it.each`
    style                               | newStyle
    ${"fontSize: medium"}               | ${"fontSize: tokens.fontSizeBase300"}
    ${"fontWeight: fontWeightRegular"}  | ${"fontWeight: tokens.fontWeightRegular"}
    ${"fontWeight: fontWeightSemibold"} | ${"fontWeight: tokens.fontWeightSemibold"}
    ${"lineHeight: lineHeightMedium"}   | ${"lineHeight: tokens.lineHeightBase300"}
  `("transform font styles correctly", ({ style, newStyle }) => {
    const code = `
export const useStyles = makeStyles({
  root: {
    position: "absolute",
    ${style}
  },
});
`;
    expect(
      Babel.transformSync(code, {
        babelrc: false,
        configFile: false,
        plugins: [[transformTokensPlugin]],
      }).code
    ).toEqual(`export const useStyles = makeStyles({
  root: {
    position: "absolute",
    ${newStyle}
  }
});`);
  });

  it.each(["large", "siteVariables.fontSizes.large"])(
    "transform fontSize large with FIXME",
    (style) => {
      const code = `
export const useStyles = makeStyles({
  root: {
    position: "absolute",
    fontSize: ${style}
  },
});
`;
      expect(
        Babel.transformSync(code, {
          babelrc: false,
          configFile: false,
          plugins: [[transformTokensPlugin]],
        }).code
      ).toEqual(`export const useStyles = makeStyles({
  root: {
    position: "absolute",
    // Warning: please notice v0 'large' is 18px; it maps to v9 fontSizeBase400 (16px) or fontSizeBase500 (20px)
    fontSize: tokens.fontSizeBase400
  }
});`);
    }
  );

  it("transform color token correctly", () => {
    const code = `
export const useStyles = makeStyles({
  root: {
    margin: "1rem 0 1rem 2rem",
    color: colorSchemeDefault.foreground1,
    borderTop: \`.2rem solid $\{colorSchemeDefault.foregroundHover}\`,
    ":hover": {
      color: colorSchemeDefault.foregroundHover,
      backgroundColor: colorSchemeRed.backgroundHover1,
    },
  },
});
`;
    expect(
      Babel.transformSync(code, {
        babelrc: false,
        configFile: false,
        plugins: [[transformTokensPlugin]],
      }).code
    ).toMatchInlineSnapshot(`
      "export const useStyles = makeStyles({
        root: {
          margin: "1rem 0 1rem 2rem",
          color: tokens.colorNeutralForeground2,
          borderTop: \`.2rem solid \${tokens.colorNeutralForeground2Hover}\`,
          ":hover": {
            color: tokens.colorNeutralForeground2Hover,
            // FIXME: ❌ No v9 matching found for token colorSchemeRed.backgroundHover1
            backgroundColor: colorSchemeRed.backgroundHover1
          }
        }
      });"
    `);
  });

  it("Add FIXME to single color", () => {
    const code = `
export const useStyles = makeStyles({
  root: {
    margin: "1rem 0 1rem 2rem",
    color: colors.brand["500"],
    backgroundColor: grey["550"],
    borderRightColor: colors.white,

    ":active": {
      backgroundColor: isPositive
        ? colors.grey["250"]
        : colorSchemeBrand.borderPressed,
    },
  },
});
`;
    expect(
      Babel.transformSync(code, {
        babelrc: false,
        configFile: false,
        plugins: [[transformTokensPlugin]],
      }).code
    ).toMatchInlineSnapshot(`
      "export const useStyles = makeStyles({
        root: {
          margin: "1rem 0 1rem 2rem",
          // FIXME: ⚠️ No v9 matching found for token colors.brand["500"], its value is \`#7579eb\`
          // You can locate a token in https://react.fluentui.dev/?path=/docs/theme-color--page
          color: colors.brand["500"],
          // FIXME: ⚠️ No v9 matching found for token grey["550"], its value is \`#3d3d3d\`
          // You can locate a token in https://react.fluentui.dev/?path=/docs/theme-color--page
          backgroundColor: grey["550"],
          // FIXME: ❌ color white detected; Consider replacing with token in https://react.fluentui.dev/?path=/docs/theme-color--page
          borderRightColor: colors.white,
          ":active": {
            // FIXME: ❌ No v9 matching found for token colorSchemeBrand.borderPressed
            // FIXME: ⚠️ No v9 matching found for token colors.grey["250"], its value is \`#c7c7c7\`
            // You can locate a token in https://react.fluentui.dev/?path=/docs/theme-color--page
            backgroundColor: isPositive ? colors.grey["250"] : colorSchemeBrand.borderPressed
          }
        }
      });"
    `);
  });
});
