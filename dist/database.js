"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/database.ts
var database_exports = {};
__export(database_exports, {
  config: () => config,
  knex: () => knex
});
module.exports = __toCommonJS(database_exports);
var import_config = require("dotenv/config");
var import_path = __toESM(require("path"));
var import_knex = require("knex");
var import_process = require("process");
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL env not found");
}
var config = {
  client: "sqlite3",
  connection: {
    filename: import_process.env.DATABASE_URL || "./default-database.sqlite"
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: import_path.default.resolve(__dirname, "..", "database", "migrations")
  }
};
var knex = (0, import_knex.knex)(config);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  config,
  knex
});
