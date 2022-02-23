export const SHORTHANDS_KEYWORD_FOR_EASY_REPLACE =
  'SHORTHANDS_KEYWORD_FOR_EASY_REPLACE';

export const transformShorthandsHelper = (code?: any) =>
  code
    ? code.replaceAll(SHORTHANDS_KEYWORD_FOR_EASY_REPLACE, '...shorthands')
    : code;
