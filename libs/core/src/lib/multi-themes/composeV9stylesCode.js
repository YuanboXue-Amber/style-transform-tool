import * as JSON5 from 'json5';

const styleObjectToString = (obj) => {
  let stylesStr = JSON5.stringify(obj); // JSON5 does not add quotes on key
  stylesStr = stylesStr.slice(1, stylesStr.length - 1); // remove {}
  return stylesStr + ',';
};

// Given a styles object like:
// {
//   root: {
//     "teams": {
//       // some styles
//     },
//     "teams-v2": {
//       // some styles
//     },
//     "teams-dark": {
//       // some styles
//     }
//   }
// }
// create a valid makeStyles string from it
export const composeV9stylesCode = (computedStyles) => {
  const addSlotComments = Object.keys(computedStyles).length > 1;

  let result = '';

  Object.keys(computedStyles).forEach((slotName) => {
    const themedStyles = computedStyles[slotName];
    const slotStyles = {
      [slotName]: '',
      [`${slotName}TFL`]: '',
      [`${slotName}Dark`]: '',
      [`${slotName}DarkTFL`]: '',
      [`${slotName}Contrast`]: '',
    };

    Object.keys(themedStyles).forEach((themeName) => {
      const stylesObject = themedStyles[themeName];
      if (!stylesObject) {
        return;
      }

      // merge v1/v2 styles if both present;
      // create a separate slot for tfl styles
      switch (themeName) {
        case 'teams':
          slotStyles[slotName] += styleObjectToString(stylesObject);
          break;
        case 'teams-v2':
          slotStyles[slotName] +=
            (themedStyles['teams'] ? '\n// styles from teams-v2 theme\n' : '') +
            styleObjectToString(stylesObject);
          break;

        case 'teams-tfl':
          slotStyles[`${slotName}TFL`] += styleObjectToString(stylesObject);
          break;

        case 'teams-dark':
          slotStyles[`${slotName}Dark`] += styleObjectToString(stylesObject);
          break;
        case 'teams-dark-v2':
          (slotStyles[`${slotName}Dark`] += themedStyles['teams-dark']
            ? '\n// styles from teams-dark-v2 theme\n'
            : '') + styleObjectToString(stylesObject);
          break;

        case 'teams-dark-tfl':
          slotStyles[`${slotName}DarkTFL`] += styleObjectToString(stylesObject);
          break;

        case 'teams-high-contrast':
          slotStyles[`${slotName}Contrast`] +=
            styleObjectToString(stylesObject);
          break;
      }
    });

    let slotResult = '';
    Object.keys(slotStyles).forEach((key) => {
      const stylesStr = slotStyles[key];
      if (!stylesStr.length) {
        return;
      }
      slotResult += `${key}: { ${stylesStr} },`;
    });

    result +=
      (addSlotComments
        ? `\n// styles from ${slotName} slot (❗️ slots can be different on v9 components)\n`
        : '') + slotResult;
  });

  return `export const useStyles = makeStyles({ \n ${result} })`;
};
