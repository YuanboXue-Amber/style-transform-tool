#!/usr/bin/env node
import prompts from 'prompts';
import { transformFile } from '../lib/core';
import path from 'path';

const isNamespaced = (filename) =>
  filename.indexOf('-namespace-') > 0 ? true : false;

const questions = [
  {
    type: 'text',
    name: 'filename',
    message: 'What is the path to the styles file?',
  },
  {
    type: (_prev, value) => (isNamespaced(value.filename) ? null : 'list'),
    name: 'variables',
    // TODO none boolean objects?
    message: 'What are the variables? (separate by comma)',
    initial: '',
    separator: ',',
  },
  {
    type: (_prev, value) => (isNamespaced(value.filename) ? 'text' : null),
    name: 'namespacedVariable',
    message: 'What is the variable name? (currently only accept 1)',
    initial: '',
  },
  {
    type: (_prev, value) => (isNamespaced(value.filename) ? 'text' : null),
    name: 'variableProps',
    message: 'What is the variableProps, if any?',
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
    name: 'theme',
    message: 'What is the theme?',
    initial: 0,
    choices: [
      { title: 'light', value: 'light' },
      { title: 'dark', value: 'dark' },
      { title: 'high contrast', value: 'contrast' },
    ],
  },
];

(async () => {
  const response = await prompts(questions);
  const {
    filename,
    exportName,
    theme,
    variables,
    namespacedVariable,
    variableProps,
  } = response;
  const styleFilename = path.resolve(filename.trim());

  let result;

  if (isNamespaced(filename)) {
    const variablesObject = {};
    variables.forEach((variable) => {
      variablesObject[variable] = true;
    });
    result = transformFile(styleFilename, exportName, variablesObject);
  } else {
    let resolvedVariableProps = {};
    if (variableProps) {
      resolvedVariableProps = JSON.parse(variableProps);
    }
    result = transformFile(
      styleFilename,
      exportName,
      namespacedVariable,
      resolvedVariableProps
    );
  }

  console.log(result);

  // const { filename, theme, variables } = response;
  // const variablesObject = {};
  // variables.forEach((variable) => {
  //   variablesObject[variable] = true;
  // });
  // console.log(transformFile(path.resolve(filename), variablesObject));
})();
