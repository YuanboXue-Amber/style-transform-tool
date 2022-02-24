import { transformFile } from './core';
const path = require('path');

describe('transformWithLinaria', () => {
  it('should work', () => {
    const styleFilename = path.resolve(
      '/Users/yuanboxue/dev/TMP/t2/teams-modular-packages/packages/components/components-teams-stardust-ui/src/themes/teams/components/Slider/slider-styles.ts'
    );
    expect(transformFile(styleFilename)).toMatchInlineSnapshot();
  });
});
