import { transformFile } from './core';
const path = require('path');

describe('transformWithLinaria', () => {
  it('should work', () => {
    const styleFilename = path.resolve(
      '/Users/yuanboxue/dev/TMP/t2/teams-modular-packages/packages/components/components-teams-stardust-ui/src/themes/teams/components/Slider/slider-styles.ts'
    );
    expect(
      transformFile(styleFilename, {
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
});
