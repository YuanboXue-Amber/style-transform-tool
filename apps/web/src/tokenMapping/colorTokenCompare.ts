import { unifyColor } from "./getColorToken";

export interface ColorTokenValue {
  light: string;
  dark: string;
  contrast: string;
}

export const unifyToken = (token: ColorTokenValue) => {
  return {
    light: unifyColor(token.light),
    dark: unifyColor(token.dark),
    contrast: unifyColor(token.contrast),
  };
};

export const isTokenSameColor = (t1: ColorTokenValue, t2: ColorTokenValue) => {
  const unifiedToken1 = unifyToken(t1);
  const unifiedToken2 = unifyToken(t2);
  return (
    unifiedToken1.light === unifiedToken2.light &&
    unifiedToken1.dark === unifiedToken2.dark &&
    unifiedToken1.contrast === unifiedToken2.contrast
  );
};

export const numberOfDiffColors = (
  t1: ColorTokenValue,
  t2: ColorTokenValue
) => {
  const unifiedToken1 = unifyToken(t1);
  const unifiedToken2 = unifyToken(t2);
  return (
    (unifiedToken1.light !== unifiedToken2.light ? 1 : 0) +
    (unifiedToken1.dark !== unifiedToken2.dark ? 1 : 0) +
    (unifiedToken1.contrast !== unifiedToken2.contrast ? 1 : 0)
  );
};
