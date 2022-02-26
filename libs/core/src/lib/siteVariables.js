import {
  teamsV2Theme,
  teamsDarkV2Theme,
  teamsHighContrastTheme,
} from '@fluentui/react-northstar';
const mapping = require('../mapping.json');

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

const getNamespaceTokens = (processedTheme) => ({
  ...processedTheme.siteVariables,
  colorSchemeDefault: processedTheme.siteVariables.colorScheme['default'],
  colorSchemeBrand: processedTheme.siteVariables.colorScheme['brand'],
  colorSchemePink: processedTheme.siteVariables.colorScheme['pink'],
  colorSchemeRed: processedTheme.siteVariables.colorScheme['red'],
  colorSchemeGreen: processedTheme.siteVariables.colorScheme['green'],
  colorSchemeYellow: processedTheme.siteVariables.colorScheme['yellow'],
  colorSchemeOrange: processedTheme.siteVariables.colorScheme['orange'],
  colorSchemeOnyx: processedTheme.siteVariables.colorScheme['onyx'],
  colorSchemeSilver: processedTheme.siteVariables.colorScheme['silver'],
});
export const namespaceTokensLight = getNamespaceTokens(processedLightTheme);

export const hasToken = (str) => str.indexOf('siteVariables_colorScheme_') >= 0;

// TODO what about non-color token
export const replaceTokens = (str) =>
  `\`${str
    .split(' ')
    .map((word) => (hasToken(word) ? replaceOneToken(word) : word))
    .join(' ')}\``;

const replaceOneToken = (token) => {
  if (token.indexOf('siteVariables_colorScheme') >= 0) {
    // token is color token
    const keys = token.split('_');
    let scheme, color;
    for (let i = 0; i < keys.length; ++i) {
      if (keys[i] === 'colorScheme') {
        scheme = keys[i + 1];
        color = keys[i + 2];
        break;
      }
    }
    if (scheme && color) {
      const v9Token = mapping?.[scheme]?.[color];
      if (v9Token) {
        return `$\{${v9Token}}`;
      }
    }
  }
  // token is not color token, use its value
  return token.split('_').pop();
};
