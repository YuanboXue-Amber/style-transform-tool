import * as path from 'path';
import * as fs from 'fs';
import { getNormalizedAbsolutePath, findGitRoot } from './findGitRoot';
import { tmpThemes } from '../constants';

const getComponentFolderName = (filename) => {
  const absPath = getNormalizedAbsolutePath(filename).split(path.sep);
  const stardustFolderIndex = absPath.findIndex(
    (folder) => folder === 'components-teams-stardust-ui'
  );
  return absPath[stardustFolderIndex + 5];
};

// given any styles filename, find the styles in other themes folder in TMP.
// return an object, with key being the tmp themes, value being the full path to the theme file, if it exists.
export const guessOtherThemeFiles = (filename) => {
  const basename = path.basename(filename);

  // find git root
  const gitRoot = findGitRoot(filename);
  if (!gitRoot) {
    return {
      success: false,
    };
  }

  // find folder name of the component
  const componentFolder = getComponentFolderName(filename);

  const themesFiles = Object.keys(tmpThemes).map((theme) => {
    const themeFolder = path.join(
      gitRoot,
      'packages',
      'components',
      'components-teams-stardust-ui',
      'src',
      'themes',
      theme,
      'components',
      componentFolder
    );

    const themeFile = path.join(themeFolder, basename);
    if (fs.existsSync(themeFile)) {
      return themeFile;
    }
    return undefined;
  });

  return {
    ...themesFiles,
    success: true,
  };
};

// given any styles filename, guess the theme folder name
// teams/teams-tfl/teams-v2/teams-dark/teams-dark-tfl/teams-dark-v2/teams-hight-contrast,
// return tmpThemes
export const guessTMPtheme = (filename) => {
  const absPath = getNormalizedAbsolutePath(filename).split(path.sep);
  const stardustFolderIndex = absPath.findIndex(
    (folder) => folder === 'components-teams-stardust-ui'
  );
  const tmpThemeName = absPath[stardustFolderIndex + 3];
  if (tmpThemeName) {
    return tmpThemes[tmpThemeName] ?? tmpThemes.teams;
  }
  return tmpThemes.teams;
};
