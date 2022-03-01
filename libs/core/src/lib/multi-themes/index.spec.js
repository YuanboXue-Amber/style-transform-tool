import { tmpThemes } from '../constants';
import { isNamespaced, guessOtherThemeFiles, guessTMPtheme } from './index';

describe('isNamespaced', () => {
  it('should work', () => {
    expect(isNamespaced('button-styles.ts')).not.toBeTruthy();
    expect(
      isNamespaced(
        'packages/components/components-teams-stardust-ui/src/themes/teams/components/Button/button-namespace-info-pane.ts'
      )
    ).toBeTruthy();
  });
});

describe('guessOtherThemeFiles', () => {
  it('should work for abs path', () => {
    expect(
      guessOtherThemeFiles(
        '/Users/yuanboxue/dev/TMP/t5/teams-modular-packages/packages/components/components-teams-stardust-ui/src/themes/teams/components/Tree/tree-title-namespace-chatList.ts'
      )
    ).toEqual({
      0: '/Users/yuanboxue/dev/TMP/t5/teams-modular-packages/packages/components/components-teams-stardust-ui/src/themes/teams/components/Tree/tree-title-namespace-chatList.ts',
      1: undefined,
      2: undefined,
      3: undefined,
      4: '/Users/yuanboxue/dev/TMP/t5/teams-modular-packages/packages/components/components-teams-stardust-ui/src/themes/teams-dark-v2/components/Tree/tree-title-namespace-chatList.ts',
      5: '/Users/yuanboxue/dev/TMP/t5/teams-modular-packages/packages/components/components-teams-stardust-ui/src/themes/teams-dark-tfl/components/Tree/tree-title-namespace-chatList.ts',
      6: '/Users/yuanboxue/dev/TMP/t5/teams-modular-packages/packages/components/components-teams-stardust-ui/src/themes/teams-high-contrast/components/Tree/tree-title-namespace-chatList.ts',
      success: true,
    });
  });
});

describe('guessTMPtheme', () => {
  it('should work', () => {
    expect(
      guessTMPtheme(
        '/Users/yuanboxue/dev/TMP/t5/teams-modular-packages/packages/components/components-teams-stardust-ui/src/themes/teams/components/Button/button-namespace-lightbox.ts'
      )
    ).toEqual(tmpThemes.teams);

    expect(
      guessTMPtheme(
        '/Users/yuanboxue/dev/TMP/t5/teams-modular-packages/packages/components/components-teams-stardust-ui/src/themes/teams-high-contrast/components/Alert/alert-styles.ts'
      )
    ).toEqual(tmpThemes['teams-high-contrast']);
  });
});
