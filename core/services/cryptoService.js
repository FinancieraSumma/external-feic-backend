const crypto = require('crypto');

function generateRandomHexString() {
  return crypto.randomBytes(16).toString('hex');
}

module.exports = generateRandomHexString;