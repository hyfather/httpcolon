let config;
try {
  config = require('eslint-config-mantine/.prettierrc.js');
} catch (err) {
  config = {
    trailingComma: 'es5',
    tabWidth: 2,
    semi: true,
    singleQuote: true,
    printWidth: 80,
  };
}
module.exports = config;
