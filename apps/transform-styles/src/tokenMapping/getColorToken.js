import mapping from '@fluentui-style-transform/tokenMapping';
import {
  teamsLightTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
} from '@fluentui/react-theme';
import {
  teamsV2Theme,
  teamsDarkV2Theme,
  teamsHighContrastTheme as v0teamsHighContrastTheme,
} from '@fluentui/react-northstar';

export const v0MappedSchemes = Object.keys(mapping);

export const v0ToV9 = ({ scheme, token }) => mapping[`${scheme}`]?.[`${token}`];

export const getTokensFromScheme = (scheme) =>
  Object.keys(mapping[`${scheme}`] ?? {});

export const getV0ColorValues = ({ scheme, token }) => ({
  light: teamsV2Theme.siteVariables.colorScheme[`${scheme}`][`${token}`],
  dark: teamsDarkV2Theme.siteVariables.colorScheme[`${scheme}`][`${token}`],
  contrast:
    v0teamsHighContrastTheme.siteVariables.colorScheme[`${scheme}`][`${token}`],
});

export const getV9ColorValues = ({ scheme, token }) => {
  const v9Token = v0ToV9({ scheme, token });
  return {
    light: teamsLightTheme[`${v9Token}`],
    dark: teamsDarkTheme[`${v9Token}`],
    contrast: teamsHighContrastTheme[`${v9Token}`],
  };
};

export const unifyColor = (color) =>
  color.length < 7
    ? '#' +
      color
        .slice(1)
        .split('')
        .map((d) => d + d)
        .join('')
        .toLowerCase()
    : color.toLowerCase();
