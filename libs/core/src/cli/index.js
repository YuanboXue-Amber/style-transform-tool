#!/usr/bin/env node
import prompts from 'prompts';
import { transformFile } from '../lib/core';
import path from 'path';

const questions = [
  {
    type: 'text',
    name: 'filename',
    message: 'What is the path of the styles file?',
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
  {
    type: 'list',
    name: 'variables',
    // TODO none boolean objects?
    message: 'What are the variables? (separate by comma)',
    initial: '',
    separator: ',',
  },
];

(async () => {
  const response = await prompts(questions);
  const { filename, theme, variables } = response;
  const variablesObject = {};
  variables.forEach((variable) => {
    variablesObject[variable] = true;
  });
  console.log(transformFile(path.resolve(filename), variablesObject));
})();
