import { transformStylesObject } from "./transform-style-object";

describe("transformStyleObject", () => {
  it("should work", () => {
    expect(
      transformStylesObject(` {
      margin: "1rem 0 1rem 2rem",
      color: colorSchemeDefault.foreground1,
      fontWeight: fontWeightRegular,
      fontSize: medium,
    }`)
    ).toMatchInlineSnapshot(`
      " { ...shorthands.margin("1rem", "0", "1rem", "2rem"),
          color: tokens.colorNeutralForeground2,
          fontWeight: tokens.fontWeightRegular,
          fontSize: tokens.fontSizeBase300
        }
      "
    `);

    expect(
      transformStylesObject(`{
        overflow: isScroll ? 'scroll' : isHidden ? 'hidden' : "auto",
        color: colorSchemeDefault.foreground,
        background: colorSchemeDefault.background,
        backgroundColor: colorSchemeDefault.background,
        position: "absolute",
        left: "50%",
        top: "50%",
        overflow: "auto",
        transform: "translateX(-50%) translateY(-50%)",
        textDecoration: "underline overline dotted",
        borderRadius: 1,
        border: \`.2rem solid $\{colorSchemeDefault.foregroundHover}\`,
        ":hover": {
          color: colorSchemeDefault.foregroundHover,
          backgroundColor: colorSchemeDefault.backgroundHover1,
        },
        ":active": {
          backgroundColor: isPositive
            ? colors.grey["250"]
            : colorSchemeBrand.borderPressed,
        },
        fontSize: siteVariables.fontSizes.large,
        fontSize: large,
        fontWeight: fontWeightSemibold,
        fontWeight: fontWeightBold,
        lineHeight: lineHeightMedium,
      }`)
    ).toMatchInlineSnapshot(`
      " { // FIXME: ❌ Conditional expression detected. Only static values are allowed in makeStyles; please create separate slots for each condition and apply them using \`mergeClasses\`
          ...shorthands.overflow(isScroll ? 'scroll' : isHidden ? 'hidden' : "auto"),
          color: tokens.colorNeutralForeground1,
          backgroundColor: tokens.colorNeutralBackground1,
          backgroundColor: tokens.colorNeutralBackground1,
          position: "absolute",
          left: "50%",
          top: "50%",
          ...shorthands.overflow("auto"),
          transform: "translateX(-50%) translateY(-50%)",
          // FIXME: ❌ unsupported css property, please manually expand shorthand
          textDecoration: "underline overline dotted",
          ...shorthands.borderRadius(1),
          ...shorthands.border(".2rem", "solid", tokens.colorNeutralForeground2Hover),
          ":hover": {
            color: tokens.colorNeutralForeground2Hover,
            backgroundColor: tokens.colorNeutralBackground4Hover
          },
          ":active": {
            // FIXME: ❌ No v9 matching found for token colorSchemeBrand.borderPressed
            // FIXME: ⚠️ No v9 matching found for token colors.grey["250"], its value is \`#c7c7c7\`
            // You can locate a token in https://react.fluentui.dev/?path=/docs/theme-color--page
            // FIXME: ❌ Conditional expression detected. Only static values are allowed in makeStyles; please create separate slots for each condition and apply them using \`mergeClasses\`
            backgroundColor: isPositive ? colors.grey["250"] : colorSchemeBrand.borderPressed
          },
          // Warning: please notice v0 'large' is 18px; it maps to v9 fontSizeBase400 (16px) or fontSizeBase500 (20px)
          fontSize: tokens.fontSizeBase400,
          // Warning: please notice v0 'large' is 18px; it maps to v9 fontSizeBase400 (16px) or fontSizeBase500 (20px)
          fontSize: tokens.fontSizeBase400,
          fontWeight: tokens.fontWeightSemibold,
          // FIXME: ❌ No v9 matching found for token fontWeightBold
          fontWeight: fontWeightBold,
          lineHeight: tokens.lineHeightBase300
        }
      "
    `);

    expect(
      transformStylesObject(`{
      color: colors.brand["500"],
      background: grey["550"],
      borderRightColor: colors.white,
    }`)
    ).toMatchInlineSnapshot(`
      " {
          // FIXME: ⚠️ No v9 matching found for token colors.brand["500"], its value is \`#7579eb\`
          // You can locate a token in https://react.fluentui.dev/?path=/docs/theme-color--page
          color: colors.brand["500"],
          // FIXME: ⚠️ No v9 matching found for token grey["550"], its value is \`#3d3d3d\`
          // You can locate a token in https://react.fluentui.dev/?path=/docs/theme-color--page
          backgroundColor: grey["550"],
          // FIXME: ❌ color white detected; Consider replacing with token in https://react.fluentui.dev/?path=/docs/theme-color--page
          borderRightColor: colors.white
        }
      "
    `);
  });
});
