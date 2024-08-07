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
    borderColor: 'red',
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
          flex: 1,
          animation: "example 5s linear 2s infinite alternate",
          padding: "5px",
          background: tokens.colorNeutralForeground1,
          background: 'red',
          border: \`.2rem solid $\{tokens.colorNeutralForeground2Hover}\`,
          borderTop: \`\${myWidth} solid $\{tokens.colorNeutralForeground2Hover}\`,
          // FIXME: ❌ unsupported css property, please manually expand shorthand
          borderColor: 'red'
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
});
