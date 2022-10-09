const util = jest.requireActual("util");  // get the real util

util.promisify = (...args) => args[0];

module.exports = util;