import {
  teamsV2Theme,
  teamsDarkV2Theme,
  teamsHighContrastTheme,
} from '@fluentui/react-northstar';

// recursively iterate thru an object, replace the value into key_value string
const valueToString = (object, result, prefix = '') => {
  Object.entries(object).forEach(([key, value]) => {
    result[key] = result[key] ?? {};
    if (typeof value === 'object') {
      valueToString(value, result[key], `${prefix}_${key}`);
    } else {
      result[key] = `${prefix}_${key}_${value}`;
    }
  });
};

// replace a theme's color token into string
const replaceSiteVaribles = (theme) => {
  const procssedSiteVariables = {};
  valueToString(theme?.siteVariables, procssedSiteVariables, 'siteVariables');
  return {
    ...theme,
    siteVariables: procssedSiteVariables,
  };
};

export const processedLightTheme = replaceSiteVaribles(teamsV2Theme);
const processedDarkTheme = replaceSiteVaribles(teamsDarkV2Theme);
const processedContrastTheme = replaceSiteVaribles(teamsHighContrastTheme);

export const hasToken = (str) => str.indexOf('siteVariables_colorScheme_') >= 0;
