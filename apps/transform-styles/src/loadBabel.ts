import { BabelFileResult } from '@babel/core';
import * as Babel from '@babel/standalone';
import {
  transformShorthandsHelper,
  transformShorthandsPlugin,
} from '@fluentui-style-transform/babel-transform-shorthands';

export const plugins: any = {};

plugins['babel-transform-namespaced-styles'] =
  require('./lib/babel-transform-namespaced-styles.js').default;
plugins['babel-transform-shorthands'] = transformShorthandsPlugin;

export type TransformNameSpacedStyle = (
  code: string,
  userVariables: string[]
) => { code?: string; hasMultiSlots?: boolean; error?: string };

export const transformNameSpacedStyle: TransformNameSpacedStyle = (
  code: string,
  userVariables: string[]
) => {
  try {
    const resultFromBabel = Babel.transform(code, {
      filename: 'styles.ts',
      presets: ['typescript'],
      plugins: [
        [
          plugins['babel-transform-namespaced-styles'],
          {
            userVariables,
          },
        ],
        [plugins['babel-transform-shorthands']],
      ],
      highlightCode: false,
      ast: true,
    });

    return {
      code: transformShorthandsHelper(resultFromBabel.code),
      hasMultiSlots: isMultiSlot(resultFromBabel),
    };
  } catch (error) {
    return { error: (error as any)?.toString() };
  }
};

const isMultiSlot = ({ ast }: Pick<BabelFileResult, 'ast'>) => {
  const slotsNum = (
    ast?.program?.body?.filter(
      (node) => node.type === 'ExportNamedDeclaration'
    )?.[0] as any
  )?.declaration?.declarations?.[0]?.init?.arguments?.[0].properties?.length;
  return slotsNum > 1;
};

/// ------------ below is used for transform shorthands in style object

export const isUserCodeObject = (userCode: string) => {
  userCode = removeCommentsFromStyleObject(userCode);

  if (userCode[0] === '{' && userCode[userCode.length - 1] === '}') {
    return true;
  }
  return false;
};

const removeCommentsFromStyleObject = (userCode: string) =>
  userCode
    .split('\n')
    .filter((line) => !line.trim().startsWith('//'))
    .join('\n')
    .trim();

export type TransformShorthandsInStyleObject = (code: string) => string;
export const transformShorthandsInStyleObject: TransformShorthandsInStyleObject =
  (code) => {
    try {
      const resultFromBabel = Babel.transform(
        `export const useStyles = makeStyles({special_root: \n ${code}})`,
        {
          filename: 'styles.ts',
          presets: ['typescript'],
          plugins: [[plugins['babel-transform-shorthands']]],
          highlightCode: false,
        }
      );

      const extractStyleObject =
        resultFromBabel.code &&
        transformShorthandsHelper(
          resultFromBabel.code.slice(
            resultFromBabel.code.indexOf('special_root:') +
              'special_root:'.length,
            resultFromBabel.code.length - 3
          )
        );
      return extractStyleObject ?? code;
    } catch (error) {
      return code;
    }
  };
