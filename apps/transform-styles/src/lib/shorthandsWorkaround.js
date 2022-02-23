export const showthandsKeywordForEasyReplace =
  "SHORTHANDS_KEYWORD_FOR_EASY_REPLACE";

export const transformShorthands = (code) =>
  code
    ? code.replaceAll(showthandsKeywordForEasyReplace, "...shorthands")
    : code;
