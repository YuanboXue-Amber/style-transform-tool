import { transform } from "./transform";

describe("transform", () => {
  it("works", () => {
    // mapping exist
    expect(
      transform(`export const useStyles = makeStyles({
          root: {
            '& .ui-layout__main': {
              backgroundColor: 'siteVariables_colorScheme_brand_background2_#3d3e78',
              color: 'siteVariables_colorScheme_default_foreground3_#fff',
              fontWeight: 'siteVariables_fontWeightRegular_400'
            },
          },
        });
        `)
    ).toMatchInlineSnapshot(`
      "export const useStyles = makeStyles({
        root: {
          '& .ui-layout__main': {
            // FIXME: ⚠️ No v9 matching found for token colorScheme.brand.background2, using its value \`#3d3e78\` as placeholder
            backgroundColor: "#3d3e78",
            color: tokens.colorNeutralForegroundInverted,
            fontWeight: tokens.fontWeightRegular
          }
        }
      });"
    `);
    expect(
      transform(`export const useStyles = makeStyles({
        root: {
          ':before': {
            border:
              '.2rem solid siteVariables_colorScheme_default_foreground3_#fff',
          },
        },
      });
      `)
    ).toMatchInlineSnapshot(`
      "export const useStyles = makeStyles({
        root: {
          ':before': { ...shorthands.border(".2rem", "solid", tokens.colorNeutralForegroundInverted)
          }
        }
      });"
    `);
    expect(
      transform(`export const useStyles = makeStyles({
        root: {
          ':before': {
            border: '.2rem solid transparent'
          },
        },
      });`)
    ).toMatchInlineSnapshot(`
      "export const useStyles = makeStyles({
        root: {
          ':before': { ...shorthands.border(".2rem", "solid", "transparent")
          }
        }
      });"
    `);
    expect(
      transform(`export const useStyles = makeStyles({
        root: {
          fontSize: 'siteVariables_fontSizes_medium_0.875rem',
          fontWeight: 'siteVariables_fontWeightBold_700',
          backgroundColor: 'siteVariables_colorScheme_default_background_#fff',
          border: 'solid 0.1rem siteVariables_colorScheme_default_border_#d1d1d1',
          borderRadius: 'siteVariables_borderRadiusMedium_4px',
          fontFamily:
            "siteVariables_codeFontFamily_'Cascadia Code', Consolas, ui-monospace, Menlo, Monaco, monospace",
        },
      });`)
    ).toMatchInlineSnapshot(`
      "export const useStyles = makeStyles({
        root: {
          fontSize: tokens.fontSizeBase300,
          // FIXME: ⚠️ No v9 matching found for token fontWeightBold, using its value \`700\` as placeholder
          fontWeight: "700",
          backgroundColor: tokens.colorNeutralBackground1,
          ...shorthands.border("solid", "0.1rem", tokens.colorNeutralStroke1),
          // FIXME: ⚠️ No v9 matching found for token borderRadiusMedium, using its value \`4px\` as placeholder
          ...shorthands.borderRadius("4px"),
          // FIXME: ⚠️ No v9 matching found for token codeFontFamily, using its value \`'Cascadia\` as placeholder
          fontFamily: "'Cascadia Code', Consolas, ui-monospace, Menlo, Monaco, monospace"
        }
      });"
    `);
    expect(
      transform(`export const useStyles = makeStyles({
      root: { 
        color: 'siteVariables_colors_brand_100_#dce0fa', 
        border: 'solid 0.1rem siteVariables_colors_grey_270_#bdbdbd', 
      },
    });`)
    ).toMatchInlineSnapshot(`
      "export const useStyles = makeStyles({
        root: {
          // FIXME: ⚠️ No v9 matching found for token colors.brand.100, using its value \`#dce0fa\` as placeholder
          // You can locate a token in https://react.fluentui.dev/?path=/docs/theme-color--page
          color: "#dce0fa",
          // FIXME: ⚠️ No v9 matching found for token colors.grey.270, using its value \`#bdbdbd\` as placeholder
          // You can locate a token in https://react.fluentui.dev/?path=/docs/theme-color--page
          ...shorthands.border("solid", "0.1rem", "#bdbdbd")
        }
      });"
    `);
  });
});
