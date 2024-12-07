import type { AdminModule } from "./admin/types";
import type { WebModule } from "./web/types";

require('dotenv').config();

let Module: WebModule|AdminModule;

if (typeof process !== "undefined" && ((process.versions && process.versions.node) || process.env.RUNTIME_ENV === 'node')) {
  // console.log("Running in node.js environment");
  /** @var {AdminModule} */
  Module = require('./admin') as AdminModule;
} else {
  // console.log("Running in browser environment");
  /** @var {WebModule} */
  Module = require('./web') as WebModule;
}

export default Module;
