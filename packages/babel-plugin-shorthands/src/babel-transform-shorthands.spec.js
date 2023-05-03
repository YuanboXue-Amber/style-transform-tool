import * as Babel from "@babel/core";
import { transformShorthandsPlugin } from "./babel-transform-shorthands.js";

describe("babel-transform-shorthands", () => {
  it("transform correctly", () => {
    const code = `
export const useStyles = makeStyles({
  root: {
    flex: 1,
    animation: "example 5s linear 2s infinite alternate",
    padding: "5px",
    background: tokens.colorNeutralForeground1,
    background: 'red',
    border: \`.2rem solid $\{tokens.colorNeutralForeground2Hover}\`,
    borderTop: \`\${myWidth} solid $\{tokens.colorNeutralForeground2Hover}\`,
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
        root: { ...shorthands.flex(1),
          // FIXME: ❌ unsupported css property, please manually expand shorthand
          animation: "example 5s linear 2s infinite alternate",
          ...shorthands.padding("5px"),
          backgroundColor: tokens.colorNeutralForeground1,
          backgroundColor: 'red',
          ...shorthands.border(".2rem", "solid", tokens.colorNeutralForeground2Hover),
          ...shorthands.borderTop(myWidth, "solid", tokens.colorNeutralForeground2Hover)
        }
      });"
    `);
  });

  it("transform shorthand with numeric value correctly", () => {
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

  it("transform conditional expressions correctly", () => {
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
        root: { ...shorthands.overflow(isScroll ? 'scroll' : isHidden ? 'hidden' : "auto")
        }
      });"
    `);
  });

  it("does not transform shorthand in non-makeStyles call", () => {
    const code = `
export const styles = { 
    borderWidth: 5
};
`;

    expect(
      Babel.transformSync(code, {
        babelrc: false,
        configFile: false,
        plugins: [[transformShorthandsPlugin]],
      }).code
    ).toMatchInlineSnapshot(`
      "export const styles = {
        borderWidth: 5
      };"
    `);
  });

  it("transform flex shorthand into number instead of string correctly", () => {
    const code = `
export const useStyles = makeStyles({
  root: {
    flex: "1 1 100px",
  },
  test: {
    flex: "1 100px",
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
        root: { ...shorthands.flex(1, 1, "100px")
        },
        test: { ...shorthands.flex(1, "100px")
        }
      });"
    `);
  });
});
