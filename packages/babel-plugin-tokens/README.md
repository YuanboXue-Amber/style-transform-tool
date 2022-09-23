Babel plugin to identify @fluentui/react-northstar tokens in makeStyles call and transform it into @fluentui/react-components tokens.

```ts
import { transformTokensPlugin } from "v9helper-babel-plugin-tokens";

const result = Babel.transform(
  `
export const useStyles = makeStyles({
  root: {
    color: colorSchemeDefault.foreground,
    fontWeight: fontWeightRegular
  }
});
`,
  {
    filename: "styles.ts",
    plugins: [[transformTokensPlugin]],
  }
).code;
```

result will be:

```ts
export const useStyles = makeStyles({
  root: {
    color: tokens.colorNeutralForeground1,
    fontWeight: tokens.fontWeightRegular,
  },
});
```
