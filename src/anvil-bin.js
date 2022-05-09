/**
* @fileName
* @exports Anvil
*/
const os = require('os');
const path = require('path');

module.exports = (() => {
  // If we're on Windows, then the executable ends with .exe
  const exeSuffix = os.platform().startsWith('win') ? '.exe' : '';

// @return FOUNDRY_ANVIL_BIN_PATH
// we keep the `FOUNDRY_` prefix nomenclature
  return [process.env.FOUNDRY_ANVIL_BIN_PATH, `anvil-bin${exeSuffix}`].join(path.sep);
})();
