import { composeV9stylesCode } from "./composeV9stylesCode";

describe("composeV9stylesCode", () => {
  it("create correct makeStyles call", () => {
    expect(
      composeV9stylesCode({
        root: {
          teams: { borderColor: "black" },
          "teams-v2": {
            color: "red",
          },
        },
      })
    ).toMatchInlineSnapshot(`
      "export const useStyles = makeStyles({ 
       root: { borderColor:'black',
      // styles from teams-v2 theme
      color:'red', }, })"
    `);
  });
});
