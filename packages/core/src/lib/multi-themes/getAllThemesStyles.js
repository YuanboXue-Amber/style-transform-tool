import * as path from "path";
import * as fs from "fs";
import { getNormalizedAbsolutePath } from "./utils";
import { tmpThemes } from "./constants";

const getComponentFolderName = (filename) => {
  const absPath = getNormalizedAbsolutePath(filename).split(path.sep);
  const stardustFolderIndex = absPath.findIndex(
    (folder) => folder === "components-teams-stardust-ui"
  );
  return absPath[stardustFolderIndex + 5];
};

// given any styles filename, find the styles in other themes folder in TMP.
// return an object, with key being the tmp themes, value being the full path to the theme file, if it exists.
export const getAllThemesStylesFiles = ({ gitRoot, filename }) => {
  const basename = path.basename(filename);

  // find folder name of the component
  const componentFolder = getComponentFolderName(filename);

  const allThemesStylesFiles = {};
  Object.keys(tmpThemes).forEach((themeName) => {
    const themeFolder = path.join(
      gitRoot,
      "packages",
      "components",
      "components-teams-stardust-ui",
      "src",
      "themes",
      themeName,
      "components",
      componentFolder
    );

    const themeFile = path.join(themeFolder, basename);
    if (fs.existsSync(themeFile)) {
      allThemesStylesFiles[themeName] = themeFile;
    }
  });

  return allThemesStylesFiles;
};

// given any styles filename, guess the theme folder name
// teams/teams-tfl/teams-v2/teams-dark/teams-dark-tfl/teams-dark-v2/teams-hight-contrast
export const getCurrentTMPtheme = (filename) => {
  const absPath = getNormalizedAbsolutePath(filename).split(path.sep);
  const stardustFolderIndex = absPath.findIndex(
    (folder) => folder === "components-teams-stardust-ui"
  );
  return absPath[stardustFolderIndex + 3];
};
