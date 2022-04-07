#!/usr/bin/env node
process.env.NODE_ENV = process.env.NODE_ENV ?? 'production';
import prompts from 'prompts';
import path from 'path';
import JSON5 from 'json5'; // json5 can parse without quotes
import { isNamespaced } from '../lib/multi-themes';
import { main } from '../lib/core';

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
    message: 'What is the namespaced variableProps, if any?',
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
    name: 'isTransformAllThemes',
    message: 'Would you like to transform all themes or just the current file',
    choices: [
      { title: 'All themes', value: true },
      { title: 'Just this file', value: false },
    ],
    initial: 0,
  },
];

// function hrToSeconds(hrtime) {
//   const raw = hrtime[0] + hrtime[1] / 1e9;
//   return raw.toFixed(2) + 's';
// }

// TODO show a progress bar, cache theme
(async () => {
  console.log(
    '⚠️ The tool transforms v2 theme only. Double check colors if your experience is NOT multi-window or react-web-client.'
  );
  const response = await prompts(questions);

  const err = validate(response);
  if (err.length) {
    console.log(err);
    return;
  }

  const {
    filename,
    exportName,
    variables,
    componentProps,
    namespacedVariable,
    namespacedVariableProps,
    isTransformAllThemes,
  } = response;

  // for debug
  // {
  //   filename:
  //     '/Users/yuanboxue/dev/TMP/t2/teams-modular-packages/packages/components/components-teams-stardust-ui/src/themes/teams/components/Avatar/avatar-styles.ts',
  //   exportName: 'avatarStyles',
  //   variables: ['isHiddenParticipantsCounter', 'isCallingScreenAvatar'],
  //   isTransformAllThemes: false,
  // };

  const styleFilename = path.resolve(filename.trim());

  const isNamespacedFile = isNamespaced(filename);

  let variablesObject;

  if (!isNamespacedFile) {
    variables.forEach((variable) => {
      variablesObject = variablesObject ?? {};
      variablesObject[variable] = true;
    });
  }

  // const startT = process.hrtime();
  const result = main({
    inputFilename: styleFilename,
    exportName,
    isTransformAllThemes,
  })({
    isNamespaced: isNamespacedFile,
    // namespaced
    variableProps: namespacedVariableProps
      ? JSON5.parse(namespacedVariableProps)
      : {},
    // non-namespaced
    variables: isNamespacedFile
      ? { [namespacedVariable]: true }
      : variablesObject,
    componentProps: componentProps ? JSON5.parse(componentProps) : undefined,
  });

  // const endT = process.hrtime(startT);
  // console.log('main', hrToSeconds(endT));

  console.log(result);
})();

const validate = ({ filename, variables, namespacedVariable }) => {
  if (!filename) {
    return 'invalid filename';
  }

  if (isNamespaced(filename)) {
    if (!namespacedVariable) {
      return 'invalid variable';
    }
  } else if (!variables) {
    return 'invalid variables';
  }

  return '';
};
