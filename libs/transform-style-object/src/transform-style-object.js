import * as Babel from '@babel/standalone';
import {
  transformShorthandsHelper,
  transformShorthandsPlugin,
} from 'v9helper-babel-plugin-shorthands';
import { mapping } from './mapping';

const v0ToV9 = ({ scheme, token }) => mapping[`${scheme}`]?.[`${token}`];

const v0ToV9fontSize = (size) => mapping.font.size[size];
const v0ToV9fontWeight = (weight) => mapping.font.weight[weight];
const v0ToV9lineHeight = (lineHeight) => mapping.font.lineHeight[lineHeight];

const ALL_SCHEMES = [
  'default',
  'brand',
  'black',
  'white',
  'green',
  'orange',
  'pink',
  'red',
  'yellow',
  'silver',
  'onyx',
  'amethyst',
];

const addFixMe = (t, path) => {
  let parent = path.parentPath;
  while (parent && !t.isObjectProperty(parent)) {
    parent = parent.parentPath;
  }
  if (parent) {
    parent.addComment(
      'leading',
      ` FIXME: ❌ No v9 matching found for token ${path.toString()}`,
      true
    );
  }
};

const transformColorToken = (t, path) => {
  const key = path.get('object');
  const value = path.get('property');
  if (t.isIdentifier(key) && t.isIdentifier(value)) {
    const scheme = ALL_SCHEMES.find((schemeName) =>
      key.node.name.toLowerCase().includes(schemeName)
    );
    if (scheme) {
      const token = value.node.name;
      const v9token = v0ToV9({ scheme, token });
      if (v9token) {
        path.replaceWithSourceString(`tokens.${v9token}`);
      } else {
        addFixMe(t, path);
      }
    }
  }
};

const transfromFont = (t, path) => {
  const keyName = path.get('key').toString();
  const value = path.get('value');
  const valueName = value.toString();

  const transform = (v0Token, v0ToV9Func) => {
    const v9token = v0ToV9Func(v0Token);
    if (v9token) {
      value.replaceWithSourceString(`tokens.${v9token}`);
    } else {
      addFixMe(t, value);
    }
  };

  if (
    keyName === 'fontSize' &&
    (valueName.includes('fontSizes') ||
      Object.keys(mapping.font.size).some((v) => valueName.includes(v)))
  ) {
    const v0Token = valueName.split('.').pop();
    transform(v0Token, v0ToV9fontSize);
  } else if (keyName === 'fontWeight' && valueName.includes('fontWeight')) {
    const v0Token = valueName.slice(10).toLowerCase();
    transform(v0Token, v0ToV9fontWeight);
  } else if (keyName === 'lineHeight' && valueName.includes('lineHeight')) {
    const v0Token = valueName.slice(10).toLowerCase();
    transform(v0Token, v0ToV9lineHeight);
  }
};

// transform token + add FIXME comment in conditional expression
export const transformTokenPlugin = ({ types: t }) => {
  const visitedConditionalExpression = []; // prevent adding duplicated FIXME comments on conditional expression
  return {
    visitor: {
      ExportNamedDeclaration(path) {
        t.assertVariableDeclaration(path.node.declaration);
        t.assertVariableDeclarator(path.node.declaration.declarations[0]);
        path.traverse({
          ObjectProperty(path) {
            transfromFont(t, path);
          },

          MemberExpression(path) {
            transformColorToken(t, path);
          },

          ConditionalExpression(path) {
            let parent = path.parentPath;
            while (parent && !t.isObjectProperty(parent)) {
              parent = parent.parentPath;
            }
            if (visitedConditionalExpression.includes(parent)) {
              return;
            }
            visitedConditionalExpression.push(parent);
            if (parent) {
              parent.addComment(
                'leading',
                ` FIXME: ❌ Conditional expression detected. Only static values are allowed in makeStyles; please create separate slots for each condition and apply them using \`mergeClasses\``,
                true
              );
            }
          },
        });
      },
    },
  };
};

const transformShorthandsInStyleObject = (code) => {
  try {
    const resultFromBabel = Babel.transform(
      `export const useStyles = makeStyles({special_root: \n ${code}})`,
      {
        babelrc: false,
        configFile: false,
        filename: 'styles.ts',
        presets: ['typescript'],
        plugins: [[transformTokenPlugin], [transformShorthandsPlugin]],
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

const isUserCodeObject = (userCode) => {
  userCode = removeCommentsFromStyleObject(userCode);

  if (userCode[0] === '{' && userCode[userCode.length - 1] === '}') {
    return true;
  }
  return false;
};

const removeCommentsFromStyleObject = (userCode) =>
  userCode
    .split('\n')
    .filter((line) => !line.trim().startsWith('//'))
    .join('\n')
    .trim();

export function transformStylesObject(userCode) {
  if (isUserCodeObject(userCode)) {
    return transformShorthandsInStyleObject(userCode);
  }
  return userCode;
}
