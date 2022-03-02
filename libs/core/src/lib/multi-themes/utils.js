import * as path from 'path';
import * as fs from 'fs';

export const isNamespaced = (filename) =>
  filename.indexOf('-namespace-') > 0 ? true : false;

export const getNormalizedAbsolutePath = (filename) =>
  path.resolve(path.dirname(filename));

const recursiveFindGitRoot = (normalizedSplitedPaths) => {
  if (!normalizedSplitedPaths.length) {
    return undefined;
  }
  const dir = normalizedSplitedPaths.join(path.sep);
  const fullPath = path.join(dir, '.git');
  if (fs.existsSync(fullPath)) {
    return dir;
  }
  normalizedSplitedPaths.pop();
  return recursiveFindGitRoot(normalizedSplitedPaths);
};

export const findGitRoot = (filename) =>
  recursiveFindGitRoot(getNormalizedAbsolutePath(filename).split(path.sep));
