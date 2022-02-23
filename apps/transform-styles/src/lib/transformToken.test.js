import { transformTokenInString } from "./transformToken";

describe("transformTokenInString", () => {
  it("replace v0 token with v9", () => {
    // simple match
    expect(
      transformTokenInString(`{color: default.foreground}`)
    ).toMatchInlineSnapshot(`"{color: tokens.colorNeutralForeground1}"`);

    // two of the same token
    expect(
      transformTokenInString(`{
      color: colorSchemeDefault.foreground4,
      "& svg": { fill: colorSchemeDefault.foreground4 },
    }
    `)
    ).toMatchInlineSnapshot(`
"{
      color: tokens.colorNeutralForegroundInverted,
      \\"& svg\\": { fill: tokens.colorNeutralForegroundInverted },
    }
    "
`);

    // multiple tokens, including two of the same
    expect(
      transformTokenInString(`{
        color: colorSchemeDefault.foreground,
        background: colorSchemeDefault.background,
        backgroundColor: colorSchemeDefault.background,
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translateX(-50%) translateY(-50%)",
        ":hover": {
          color: colorSchemeDefault.foregroundHover,
          backgroundColor: colorSchemeDefault.backgroundHover1,
        },
      }`)
    ).toMatchInlineSnapshot(`
"{
        color: tokens.colorNeutralForeground1,
        background: tokens.colorNeutralBackground1,
        backgroundColor: tokens.colorNeutralBackground1,
        position: \\"absolute\\",
        left: \\"50%\\",
        top: \\"50%\\",
        transform: \\"translateX(-50%) translateY(-50%)\\",
        \\":hover\\": {
          color: tokens.colorNeutralForeground2Hover,
          backgroundColor: tokens.colorNeutralBackground4Hover,
        },
      }"
`);
  });
});
