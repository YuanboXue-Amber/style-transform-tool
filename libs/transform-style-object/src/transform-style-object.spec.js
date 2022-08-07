import { transformStylesObject } from './transform-style-object';

describe('transformStyleObject', () => {
  it('should work', () => {
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
      }`)
    ).toMatchInlineSnapshot(`
      " { // FIXME: ❌ Conditional expression detected. Only static values are allowed in makeStyles; please create separate slots for each condition and apply them using \`mergeClasses\`
          ...shorthands.overflow(isScroll ? 'scroll' : isHidden ? 'hidden' : \\"auto\\"),
          color: tokens.colorNeutralForeground1,
          backgroundColor: tokens.colorNeutralBackground1,
          backgroundColor: tokens.colorNeutralBackground1,
          position: \\"absolute\\",
          left: \\"50%\\",
          top: \\"50%\\",
          ...shorthands.overflow(\\"auto\\"),
          transform: \\"translateX(-50%) translateY(-50%)\\",
          // FIXME: ❌ unsupported css property, please manually expand shorthand
          textDecoration: \\"underline overline dotted\\",
          ...shorthands.borderRadius(1),
          ...shorthands.border(\\".2rem\\", \\"solid\\", \`\${tokens.colorNeutralForeground2Hover}\`),
          \\":hover\\": {
            color: tokens.colorNeutralForeground2Hover,
            backgroundColor: tokens.colorNeutralBackground4Hover
          },
          \\":active\\": {
            // FIXME: ❌ No v9 matching found for token colorSchemeBrand.borderPressed
            // FIXME: ❌ Conditional expression detected. Only static values are allowed in makeStyles; please create separate slots for each condition and apply them using \`mergeClasses\`
            backgroundColor: isPositive ? colors.grey[\\"250\\"] : colorSchemeBrand.borderPressed
          }
        }
      "
    `);
  });
});
