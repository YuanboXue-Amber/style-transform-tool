export const isNamespaced = (filename) =>
  filename.indexOf('-namespace-') > 0 ? true : false;
