import * as fs from 'fs';
import * as path from 'path';
import shakerEvaluator from '@linaria/shaker';
import { Module } from '@linaria/babel-preset';
import {
  teamsTheme as fluentTeamsTheme,
  teamsDarkTheme as fluentTeamsDarkTheme,
  teamsHighContrastTheme as fluentTeamsHighContrastTheme,
} from '@fluentui/react-northstar';
import * as _ from 'lodash';
import { tmpThemes } from './constants';

const linariaOptions = {
  displayName: false,
  evaluate: true,
  rules: [
    { action: shakerEvaluator },
    {
      test: /[/\\]node_modules[/\\]/,
      action: 'ignore',
    },
  ],
  babelOptions: {
    configFile: false,
    babelrc: false,
    presets: ['@babel/typescript'],
  },
};

export const getTMPsiteVariables = ({ gitRoot, themeName }) => {
  const tmpThemesFolder = path.join(
    gitRoot,
    'packages',
    'components',
    'components-teams-stardust-ui',
    'src',
    'themes'
  );

  const siteVariablesFile = path.join(
    tmpThemesFolder,
    themeName === 'teams'
      ? 'teams-v2'
      : themeName === 'teams-dark'
      ? 'teams-dark-v2'
      : themeName, // if the input is teams/teams-dark, load siteVariables from v2 theme
    'site-variables.ts'
  );

  const code = fs.readFileSync(siteVariablesFile, 'utf8');
  const mod = new Module(siteVariablesFile, linariaOptions);
  mod.evaluate(code, ['default']);
  const tmpSiteVariables = mod.exports['default'];

  // Note: I merged TMP siteVariables with fluent v1 siteVariables, because this is how TMP does it. TMP does not use fluent v2 theme.

  switch (true) {
    case tmpThemes[themeName] === tmpThemes['teams']:
    case tmpThemes[themeName] === tmpThemes['teams-v2']:
    case tmpThemes[themeName] === tmpThemes['teams-tfl']:
      return _.merge(fluentTeamsTheme.siteVariables, tmpSiteVariables);

    case tmpThemes[themeName] === tmpThemes['teams-dark']:
    case tmpThemes[themeName] === tmpThemes['teams-dark-v2']:
    case tmpThemes[themeName] === tmpThemes['teams-dark-tfl']:
      return _.merge(fluentTeamsDarkTheme.siteVariables, tmpSiteVariables);

    case tmpThemes[themeName] === tmpThemes['teams-high-contrast']:
      return _.merge(
        fluentTeamsHighContrastTheme.siteVariables,
        tmpSiteVariables
      );

    default:
      throw new Error(`Cannot find siteVariables for theme ${themeName}`);
  }
};
