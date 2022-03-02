1. theme siteVariables merging is wrong.
   In each `theme.ts` file, siteVariables is 'shallow' merged.
   For example in high contrast theme, there are some brand variables added, which causes the entire fluent contrast theme brand colors to be overriden. And in fact, `brand.foregroundHover` is used in high contrast button styles :/
