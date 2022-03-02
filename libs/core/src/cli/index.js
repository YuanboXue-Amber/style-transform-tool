#!/usr/bin/env node
import * as prompts from 'prompts';
import { transformFile, transformNamespacedFile } from '../lib/core';
import * as path from 'path';
import * as JSON5 from 'json5'; // json5 can parse without quotes
import { isNamespaced } from '../lib/multi-themes';

const questions = [
  {
    type: 'text',
    name: 'filename',
    message: 'What is the path to the styles file?',
  },
  {
    type: (_prev, value) => (isNamespaced(value.filename) ? null : 'list'),
    name: 'variables',
    // TODO! none boolean variables?
    message: 'What are the variables? (separate by comma)',
    initial: '',
    separator: ',',
  },
  {
    type: (_prev, value) => (isNamespaced(value.filename) ? null : 'select'),
    name: 'hasComponentProps',
    message: 'Are you using component props in styles?',
    choices: [
      { title: 'No', value: false },
      { title: 'Yes', value: true },
    ],
    initial: 0,
  },
  {
    type: (prev, value) =>
      !isNamespaced(value.filename) && prev ? 'text' : null,
    name: 'componentProps',
    message:
      'What are the component props used? (specify an object as a string)',
    initial: '',
  },
  {
    type: (_prev, value) => (isNamespaced(value.filename) ? 'text' : null),
    name: 'namespacedVariable',
    message: 'What is the variable name? (currently only accept 1)',
    initial: '',
  },
  {
    type: (_prev, value) => (isNamespaced(value.filename) ? 'text' : null),
    name: 'namespacedVariableProps',
    message: 'What is the namespacedVariableProps, if any?',
    initial: '',
  },
  {
    type: 'text',
    name: 'exportName',
    message: 'What is the exported style function?',
    initial: (_prev, value) => {
      if (isNamespaced(value.filename)) {
        return 'default';
      }
      // guess function name by file name
      const basename = path.basename(value.filename).split('.')[0];
      return basename
        .split('-')
        .map((word, i) =>
          i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join('');
    },
  },
  {
    type: 'select',
    name: 'transformAllThemes',
    message: 'Would you like to transform all themes or just the current file',
    choices: [
      { title: 'All themes', value: false },
      { title: 'Just this file', value: true },
    ],
    initial: 0,
  },
];

// TODO remove n* console log on 'You are running Fela in production mode'
// TODO show a progress bar, cache theme
(async () => {
  const response = await prompts(questions);
  const {
    filename,
    exportName,
    variables,
    componentProps,
    namespacedVariable,
    namespacedVariableProps,
    transformAllThemes,
  } = response;
  const styleFilename = path.resolve(filename.trim());

  let result;

  if (!isNamespaced(filename)) {
    const variablesObject = {};
    variables.forEach((variable) => {
      variablesObject[variable] = true;
    });
    result = transformFile({
      styleFilename,
      exportName,
      variables: variablesObject,
      componentProps: componentProps ? JSON5.parse(componentProps) : {},
    });
  } else {
    result = transformNamespacedFile({
      styleFilename,
      exportName,
      variable: namespacedVariable,
      variableProps: namespacedVariableProps
        ? JSON5.parse(namespacedVariableProps)
        : {},
    });
  }

  console.log(result);
})();
