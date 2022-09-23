import * as v9Exports from "@fluentui/react-icons";
import * as tmpExports from "@msteams/components-fluent-ui-icons";
import iconMappingJSON from "./iconMapping.json";

const getIcons = (exports) => {
  return Object.keys(exports).reduce((acc, exportName) => {
    if (exports[exportName].displayName) {
      acc.push(exports[exportName]);
    }

    return acc;
  }, []);
};

const tmpIcons = getIcons(tmpExports);
const v9Icons = getIcons(v9Exports).filter((icon) =>
  icon.displayName.endsWith("Regular")
);
const v9IconsNames = v9Icons.map(
  (icon) => icon.displayName.match(/([a-zA-Z0-9]+)(\d\d|)(Regular)/)[1]
);

export const iconMapping = (() => {
  const result = [];
  tmpIcons.forEach((icon) => {
    const v9Match = iconMappingJSON[icon.displayName];
    const v9MatchIdx = v9Match
      ? v9IconsNames.findIndex((v9IconName) => v9Match === v9IconName)
      : -1;
    if (v9MatchIdx >= 0) {
      result.push({
        v0: icon,
        v9: v9Icons[v9MatchIdx],
      });
    } else {
      result.push({ v0: icon, v9: null });
    }
  });
  return result;
})();
