import { mapping } from '../mapping';

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
  let replacementValue = `\`${str
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
  if (replacementValue.startsWith('`${') && replacementValue.endsWith('}`')) {
    replacementValue = replacementValue.slice(3, replacementValue.length - 2);
  }
  return {
    value: replacementValue,
    comments: noReplacement,
  };
};

const replaceOneToken = (token) => {
  let v9Token;
  if (mapping) {
    if (token.indexOf('siteVariables_colorScheme') >= 0) {
      v9Token = replaceColorToken(token);
    } else if (token.indexOf('siteVariables_fontSizes_') >= 0) {
      // font size token
      const size = token.split('_')[2];
      v9Token = mapping.font.size[size];
    } else if (token.indexOf('siteVariables_fontWeight') >= 0) {
      // font weight token
      const weight = token.split('_')[1]?.slice(10)?.toLowerCase();
      v9Token = mapping.font.weight[weight];
    } else if (token.indexOf('siteVariables_lineHeight') >= 0) {
      // line height token
      const lineHeight = token.split('_')[1]?.slice(10)?.toLowerCase();
      v9Token = mapping.font.lineHeight[lineHeight];
    }
  }

  // token is not color/font token, use its value
  return v9Token
    ? {
        replacement: `$\{tokens.${v9Token}}`,
        hasMatch: true,
      }
    : {
        replacement: token.split('_').pop(),
        hasMatch: false,
      };
};

const replaceColorToken = (token) => {
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
    return mapping?.[scheme]?.[color];
  }
  return null;
};
