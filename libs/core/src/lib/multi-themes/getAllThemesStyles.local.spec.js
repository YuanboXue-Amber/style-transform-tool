import {
  getCurrentTMPtheme,
  getAllThemesStylesFiles,
} from './getAllThemesStyles';

describe('getAllThemesStylesFiles', () => {
  it('should work', () => {
    const expected = {
      teams:
        '/Users/yuanboxue/dev/TMP/t5/teams-modular-packages/packages/components/components-teams-stardust-ui/src/themes/teams/components/Tree/tree-title-namespace-chatList.ts',
      'teams-dark-v2':
        '/Users/yuanboxue/dev/TMP/t5/teams-modular-packages/packages/components/components-teams-stardust-ui/src/themes/teams-dark-v2/components/Tree/tree-title-namespace-chatList.ts',
      'teams-dark-tfl':
        '/Users/yuanboxue/dev/TMP/t5/teams-modular-packages/packages/components/components-teams-stardust-ui/src/themes/teams-dark-tfl/components/Tree/tree-title-namespace-chatList.ts',
      'teams-high-contrast':
        '/Users/yuanboxue/dev/TMP/t5/teams-modular-packages/packages/components/components-teams-stardust-ui/src/themes/teams-high-contrast/components/Tree/tree-title-namespace-chatList.ts',
    };
    expect(
      getAllThemesStylesFiles({
        filename:
          '/Users/yuanboxue/dev/TMP/t5/teams-modular-packages/packages/components/components-teams-stardust-ui/src/themes/teams/components/Tree/tree-title-namespace-chatList.ts',
        gitRoot: '/Users/yuanboxue/dev/TMP/t5/teams-modular-packages',
      })
    ).toEqual(expected);

    expect(
      getAllThemesStylesFiles({
        filename:
          'packages/components/components-teams-stardust-ui/src/themes/teams/components/Tree/tree-title-namespace-chatList.ts',
        gitRoot: '/Users/yuanboxue/dev/TMP/t5/teams-modular-packages',
      })
    ).toEqual(expected);
  });
});

describe('getCurrentTMPtheme', () => {
  it('should work', () => {
    expect(
      getCurrentTMPtheme(
        '/Users/yuanboxue/dev/TMP/t5/teams-modular-packages/packages/components/components-teams-stardust-ui/src/themes/teams/components/Button/button-namespace-lightbox.ts'
      )
    ).toEqual('teams');

    expect(
      getCurrentTMPtheme(
        '/Users/yuanboxue/dev/TMP/t5/teams-modular-packages/packages/components/components-teams-stardust-ui/src/themes/teams-high-contrast/components/Alert/alert-styles.ts'
      )
    ).toEqual('teams-high-contrast');
  });
});
