import { transformFile, transformNamespacedFile } from './core';
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
            backgroundColor: \`\${colorNeutralForegroundDisabled}\`,
            ...shorthands.border(\\"1rem\\", \\"solid\\", \`\${colorNeutralForegroundDisabled}\`)
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
            backgroundColor: \`\${colorNeutralBackground1Hover}\`,
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
          color: \`\${colorNeutralForeground1}\`,
          '&:focus-visible': {
            backgroundColor: 'transparent',
            color: \`\${colorNeutralForeground1}\`,
            '::after': {
              left: '-.1rem',
              right: '-.1rem'
            }
          },
          '&:hover': { ...shorthands.borderColor(\\"transparent\\"),
            '&:focus-visible': {
              backgroundColor: \`\${colorNeutralBackground1Hover}\`
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
  it('should work with component props', () => {
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
          color: \`\${colorNeutralBackgroundDisabled}\`,
          width: '4.8rem',
          height: '4.8rem',
          ':hover': {
            color: \`\${colorNeutralBackgroundDisabled}\`
          },
          ':active': {
            color: \`#4f52b2\`
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

  it('should work with namespaced', () => {
    const styleFilename = path.resolve(
      '/Users/yuanboxue/dev/TMP/t2/teams-modular-packages/packages/components/components-teams-stardust-ui/src/themes/teams/components/Button/button-namespace-auth.ts'
    );
    expect(
      transformNamespacedFile(
        styleFilename,
        'default',
        'isLoginListSigninButton',
        { isMinHeightBreakpointAtLeast568: true }
      )
    ).toMatchInlineSnapshot(`
      "export const useStyles = makeStyles({
        root: {
          maxWidth: '20rem',
          minWidth: '14rem',
          width: '30vh'
        }
      });"
    `);
    expect(
      transformNamespacedFile(
        styleFilename,
        'default',
        'isAccountListUseAnotherAccountButton'
      )
    ).toMatchInlineSnapshot(`
      "export const useStyles = makeStyles({
        root: {
          '& .ui-button__content': {
            color: \`#5b5fc7\`,
            fontWeight: 'siteVariables_fontWeightRegular_400'
          }
        }
      });"
    `);
  });
});
