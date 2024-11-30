let Module;

if (typeof process !== "undefined" && ((process.versions && process.versions.node) || process.env.RUNTIME_ENV === 'node')) {
  // console.log("Running in node.js environment");
  Module = require('./admin');
} else {
  // console.log("Running in browser environment");
  Module = require('./web');
}

export default Module;
