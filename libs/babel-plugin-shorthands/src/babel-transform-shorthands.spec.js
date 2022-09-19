import * as Babel from '@babel/core';
import { transformShorthandsPlugin } from './babel-transform-shorthands.js';

describe('babel-transform-shorthands', () => {
  it('transform correctly', () => {
    const code = `
export const useStyles = makeStyles({
  root: {
    flex: 1,
    padding: "5px",
    background: tokens.colorNeutralForeground1,
    background: 'red',
    border: \`.2rem solid $\{tokens.colorNeutralForeground2Hover}\`,
  },
});
`;

    expect(
      Babel.transformSync(code, {
        babelrc: false,
        configFile: false,
        plugins: [[transformShorthandsPlugin]],
      }).code
    ).toMatchInlineSnapshot(`
      "export const useStyles = makeStyles({
        root: {
          // FIXME: ❌ unsupported css property, please manually expand shorthand
          flex: 1,
          ...shorthands.padding(\\"5px\\"),
          backgroundColor: tokens.colorNeutralForeground1,
          backgroundColor: 'red',
          ...shorthands.border(\\".2rem\\", \\"solid\\", tokens.colorNeutralForeground2Hover)
        }
      });"
    `);
  });

  it('transform shorthand with numeric value correctly', () => {
    const code = `
export const useStyles = makeStyles({
  root: { 
    borderWidth: 5, 
  },
});
`;

    expect(
      Babel.transformSync(code, {
        babelrc: false,
        configFile: false,
        plugins: [[transformShorthandsPlugin]],
      }).code
    ).toMatchInlineSnapshot(`
      "export const useStyles = makeStyles({
        root: { ...shorthands.borderWidth(5)
        }
      });"
    `);
  });

  it('transform conditional expressions correctly', () => {
    const code = `
export const useStyles = makeStyles({
  root: {
    overflow: isScroll ? 'scroll' : isHidden ? 'hidden' : "auto",
  },
});
`;

    expect(
      Babel.transformSync(code, {
        babelrc: false,
        configFile: false,
        plugins: [[transformShorthandsPlugin]],
      }).code
    ).toMatchInlineSnapshot(`
      "export const useStyles = makeStyles({
        root: { ...shorthands.overflow(isScroll ? 'scroll' : isHidden ? 'hidden' : \\"auto\\")
        }
      });"
    `);
  });
});
