import { isNamespaced } from "./utils";

describe("isNamespaced", () => {
  it("should work", () => {
    expect(isNamespaced("button-styles.ts")).not.toBeTruthy();
    expect(
      isNamespaced(
        "packages/components/components-teams-stardust-ui/src/themes/teams/components/Button/button-namespace-info-pane.ts"
      )
    ).toBeTruthy();
  });
});
