import * as mapping from '../mapping.json';

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

// replace a theme's color token into key_value string
export const replaceSiteVariblesToString = (theme) => {
  const procssedSiteVariables = {};
  valueToString(theme?.siteVariables, procssedSiteVariables, 'siteVariables');
  return {
    ...theme,
    siteVariables: procssedSiteVariables,
  };
};

export const makeNamespaceParms = (theme) => ({
  ...theme.siteVariables,
  colorSchemeDefault: theme.siteVariables.colorScheme['default'],
  colorSchemeBrand: theme.siteVariables.colorScheme['brand'],
  colorSchemePink: theme.siteVariables.colorScheme['pink'],
  colorSchemeRed: theme.siteVariables.colorScheme['red'],
  colorSchemeGreen: theme.siteVariables.colorScheme['green'],
  colorSchemeYellow: theme.siteVariables.colorScheme['yellow'],
  colorSchemeOrange: theme.siteVariables.colorScheme['orange'],
  colorSchemeOnyx: theme.siteVariables.colorScheme['onyx'],
  colorSchemeSilver: theme.siteVariables.colorScheme['silver'],
});

export const hasToken = (str) => str.indexOf('siteVariables_') >= 0;

// TODO! what about non-color token
export const tokensV0toV9 = (str) =>
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
