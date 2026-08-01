'use strict';

/**
 * Local ESLint plugin holding project-specific rules that have no upstream
 * equivalent. Registered under the `local/` namespace in eslint.config.js.
 */
module.exports = {
  rules: {
    'no-money-arithmetic': require('./no-money-arithmetic'),
  },
};
