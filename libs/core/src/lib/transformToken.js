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

export const tokensV0toV9 = (str) => {
  const noReplacement = [];
  const replacementValue = `\`${str
    .split(' ')
    .map((word) => {
      if (!hasToken(word)) {
        return word;
      }
      const matchResult = replaceOneToken(word);
      if (!matchResult.hasMatch) {
        const tokenName = word.split('_');
        tokenName.pop();
        tokenName.shift();
        noReplacement.push(
          ` FIXME: ⚠️ No v9 matching found for token ${tokenName.join(
            '.'
          )}, using its value \`${matchResult.replacement}\` as placeholder`
        );
      }
      return matchResult.replacement;
    })
    .join(' ')}\``;
  return {
    value: replacementValue,
    comments: noReplacement,
  };
};

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
        return {
          replacement: `$\{${v9Token}}`,
          hasMatch: true,
        };
      }
    }
  }
  // token is not color token, use its value
  return {
    replacement: token.split('_').pop(),
    hasMatch: false,
  };
};
