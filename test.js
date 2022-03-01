const path = require('path');

const filename = 'button-styles.ts';
console.log('base', path.basename(filename));
console.log('dir', path.resolve(path.dirname(filename)));
