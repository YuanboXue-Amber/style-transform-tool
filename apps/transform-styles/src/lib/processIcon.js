import * as v9Exports from '@fluentui/react-icons';
import * as tmpExports from '@msteams/components-fluent-ui-icons';
import nameDiffIconMapping from './nameDiffIconMapping.json';

const getIcons = (exports) => {
  return Object.keys(exports).reduce((acc, exportName) => {
    if (exports[exportName].displayName) {
      acc.push(exports[exportName]);
    }

    return acc;
  }, []);
};

const tmpIcons = getIcons(tmpExports);
const v9Icons = getIcons(v9Exports);
const v9IconsNames = v9Icons.map(
  (icon) => icon.displayName.match(/([a-zA-Z0-9]+)(\d\d|)(Filled|Regular)/)[1]
);

export const iconMapping = (() => {
  const result = [];
  tmpIcons.forEach((icon) => {
    const iconName = icon.displayName.split('Icon')[0];
    const index = v9IconsNames.findIndex(
      (v9IconName) => v9IconName === iconName
    );
    if (index >= 0) {
      result.push({ v0: icon, v9: v9Icons[index] });
    } else {
      // no name match
      const v9NameDiffMatch = nameDiffIconMapping[icon.displayName];
      const v9NameDiffMatchIdx = v9NameDiffMatch
        ? v9IconsNames.findIndex((v9IconName) => v9NameDiffMatch === v9IconName)
        : -1;
      result.push({
        v0: icon,
        v9: v9NameDiffMatchIdx >= 0 ? v9Icons[v9NameDiffMatchIdx] : null,
      });
    }
  });
  return result;
})();
