import { tokenMapping } from "v9helper-babel-plugin-tokens";
import {
  teamsLightTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
} from "@fluentui/react-components";
import {
  teamsV2Theme,
  teamsDarkV2Theme,
  teamsHighContrastTheme as v0teamsHighContrastTheme,
} from "@fluentui/react-northstar";

export const v0MappedSchemes = Object.keys(tokenMapping);

export const v0ToV9 = ({ scheme, token }) =>
  tokenMapping[`${scheme}`]?.[`${token}`];

export const getTokensFromScheme = (scheme) =>
  Object.keys(tokenMapping[`${scheme}`] ?? {});

export const getV0ColorValues = ({ scheme, token }) => ({
  light: teamsV2Theme.siteVariables.colorScheme[`${scheme}`][`${token}`],
  dark: teamsDarkV2Theme.siteVariables.colorScheme[`${scheme}`][`${token}`],
  contrast:
    v0teamsHighContrastTheme.siteVariables.colorScheme[`${scheme}`][`${token}`],
});

export const getV9ColorValues = ({ token }) => {
  return {
    light: teamsLightTheme[`${token}`],
    dark: teamsDarkTheme[`${token}`],
    contrast: teamsHighContrastTheme[`${token}`],
  };
};

export const getV0ToV9ColorValues = ({ scheme, token }) => {
  const v9Token = v0ToV9({ scheme, token });
  return getV9ColorValues({ token: v9Token });
};

export const unifyColor = (color) =>
  color.length < 7
    ? "#" +
      color
        .slice(1)
        .split("")
        .map((d) => d + d)
        .join("")
        .toLowerCase()
    : color.toLowerCase();

export const lookupv9Tokens = (value) => {
  const candidates = {};

  Object.entries(teamsLightTheme)
    .filter((entry) => entry[1] === value.light)
    .forEach((entry) => {
      candidates[entry[0]] = 1;
    });

  Object.entries(teamsDarkTheme)
    .filter((entry) => entry[1] === value.dark)
    .forEach((entry) => {
      if (candidates[entry[0]]) {
        candidates[entry[0]]++;
      } else {
        candidates[entry[0]] = 1;
      }
    });

  Object.entries(teamsHighContrastTheme)
    .filter((entry) => entry[1] === value.contrast)
    .forEach((entry) => {
      if (candidates[entry[0]]) {
        candidates[entry[0]]++;
      } else {
        candidates[entry[0]] = 1;
      }
    });

  return Object.entries(candidates)
    .sort((a, b) => a[1] < b[1])
    .filter((a) => a[1] > 1);
};
