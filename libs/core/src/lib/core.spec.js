import { transformFile } from './core';
const path = require('path');

describe('transformWithLinaria', () => {
  it('should work', () => {
    const styleFilename = path.resolve(
      '/Users/yuanboxue/dev/TMP/t2/teams-modular-packages/packages/components/components-teams-stardust-ui/src/themes/teams/components/Slider/slider-styles.ts'
    );
    expect(
      transformFile(styleFilename, 'sliderStyles', {
        isCallingVolumeSliderDisabled: true,
        isCallingPreJoinV2ComputerAudioVolumeSlider: true,
      })
    ).toMatchInlineSnapshot(`
      "export const useStyles = makeStyles({
        root: {
          '@media only screen and (max-width: undefined)': {
            '& .ui-slider__input-wrapper': {
              marginLeft: 0,
              width: '100%'
            }
          },
          // ❌ unsupported css property, please manually expand shorthand
          flex: 1,
          '& .ui-slider__rail': {
            backgroundColor: \`\${token.amberTemp}\`,
            ...shorthands.border(\\"1rem\\", \\"solid\\", \`\${token.amberTemp}\`)
          }
        }
      });"
    `);
  });
  it('should work again', () => {
    const styleFilename = path.resolve(
      '/Users/yuanboxue/dev/TMP/t2/teams-modular-packages/packages/components/components-teams-stardust-ui/src/themes/teams/components/Button/button-styles.ts'
    );
    expect(
      transformFile(styleFilename, 'buttonStyles', {
        isChatRosterActionButton: true,
        chatRosterTriggerText: true,
      })
    ).toMatchInlineSnapshot(`
      "export const useStyles = makeStyles({
        root: {
          // styles from root slot (❗️ slots can be different on v9 components)
          ':hover': {
            backgroundColor: \`\${token.amberTemp}\`,
            ...shorthands.borderWidth(\\".1rem\\"),
            ...shorthands.borderColor(\\"transparent\\"),
            // ❌ unsupported css property, please manually expand shorthand
            textDecoration: 'none'
          },
          ':active': {
            // ❌ unsupported css property, please manually expand shorthand
            transition: 'none',
            ...shorthands.borderWidth(\\".1rem\\"),
            ...shorthands.borderColor(\\"transparent\\"),
            // ❌ unsupported css property, please manually expand shorthand
            animation: 'none'
          },
          paddingLeft: '.3rem',
          display: 'flex',
          justifyContent: 'start',
          ...shorthands.borderColor(\\"transparent\\", \\"!important\\"),
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderRadius: 0,
          ...shorthands.margin(\\"0\\", \\"-1.4rem\\"),
          maxWidth: 'calc(100% + 2.8rem)',
          boxShadow: 'none',
          width: 'calc(100% + 2.8rem)',
          color: \`\${token.amberTemp}\`,
          '&:focus-visible': {
            backgroundColor: 'transparent',
            color: \`\${token.amberTemp}\`,
            '::after': {
              left: '-.1rem',
              right: '-.1rem'
            }
          },
          '&:hover': { ...shorthands.borderColor(\\"transparent\\"),
            '&:focus-visible': {
              backgroundColor: \`\${token.amberTemp}\`
            }
          },
          marginBottom: '.6rem',
          ...shorthands.border(\\"none\\"),
          fontSize: 'siteVariables_fontSizes_small_0.75rem',
          fontWeight: 'siteVariables_fontWeightBold_700',
          height: '2.8rem',
          minWidth: '2.8rem',
          paddingRight: '.3rem',
          top: '.3rem',
          // styles from icon slot (❗️ slots can be different on v9 components)
          marginRight: '0.2rem',
          ...shorthands.margin(\\"0\\", \\"1.8rem\\", \\"0\\", \\"1.3rem\\")
        }
      });"
    `);
  });
  it.only('should work with component props', () => {
    const styleFilename = path.resolve(
      '/Users/yuanboxue/dev/TMP/t2/teams-modular-packages/packages/components/components-teams-stardust-ui/src/themes/teams/components/Button/button-styles.ts'
    );
    expect(
      transformFile(
        styleFilename,
        'buttonStyles',
        {
          isDockedUbarCustomActionButton: true,
        },

        { disabled: true }
      )
    ).toMatchInlineSnapshot(`
      "export const useStyles = makeStyles({
        root: {
          borderRadius: 0,
          color: \`\${token.amberTemp}\`,
          width: '4.8rem',
          height: '4.8rem',
          ':hover': {
            color: \`\${token.amberTemp}\`
          },
          ':active': {
            color: \`\${token.amberTemp}\`
          },
          '& .ui-icon': {
            alignItems: 'center',
            display: 'flex',
            height: '4.6rem',
            justifyContent: 'center',
            width: '4.6rem'
          }
        }
      });"
    `);
  });
});
