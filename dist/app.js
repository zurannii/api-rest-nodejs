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
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/app.ts
var app_exports = {};
__export(app_exports, {
  app: () => app
});
module.exports = __toCommonJS(app_exports);
var import_fastify = __toESM(require("fastify"));

// src/database.ts
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

// src/routes/transactions.ts
var import_zod = require("zod");
var import_node_crypto = __toESM(require("crypto"));

// src/middleware/check-session-id-exists.ts
function checkSessionIdExists(request, reply) {
  return __async(this, null, function* () {
    const sessionId = request.cookies.sessionId;
    if (!sessionId) {
      return reply.status(401).send({
        error: "Unauthorized"
      });
    }
  });
}

// src/routes/transactions.ts
function transactionsRoutes(app2) {
  return __async(this, null, function* () {
    app2.addHook("preHandler", (request, reply) => __async(this, null, function* () {
      console.log(`[${request.method}] ${request.url}`);
    }));
    app2.get(
      "/",
      {
        preHandler: [checkSessionIdExists]
      },
      (request, reply) => __async(this, null, function* () {
        const { sessionId } = request.cookies;
        const transactions = yield knex("transactions").where("session_id", sessionId).select();
        return { transactions };
      })
    );
    app2.get(
      "/summary",
      {
        preHandler: [checkSessionIdExists]
      },
      (request, reply) => __async(this, null, function* () {
        const { sessionId } = request.cookies;
        const summary = yield knex("transactions").sum("amount", { as: "amount" }).where("session_id", sessionId).first();
        return { summary };
      })
    );
    app2.get(
      "/:id",
      {
        preHandler: [checkSessionIdExists]
      },
      (request, reply) => __async(this, null, function* () {
        const { sessionId } = request.cookies;
        const getTransactionParamsSchema = import_zod.z.object({
          id: import_zod.z.string().uuid()
        });
        const { id } = getTransactionParamsSchema.parse(request.params);
        const transaction = yield knex("transactions").where({
          session_id: sessionId,
          id
        }).first();
        return { transaction };
      })
    );
    app2.post("/", (request, reply) => __async(this, null, function* () {
      try {
        const createTransactionBodySchema = import_zod.z.object({
          title: import_zod.z.string(),
          amount: import_zod.z.number(),
          type: import_zod.z.enum(["credit", "debit"])
        });
        const { title, amount, type } = createTransactionBodySchema.parse(
          request.body
        );
        let sessionId = request.cookies.sessionId;
        if (!sessionId) {
          sessionId = import_node_crypto.default.randomUUID();
          reply.cookie("sessionId", sessionId, {
            path: "/",
            maxAge: 1e3 * 60 * 60 * 24 * 7
            // 7 days
          });
        }
        yield knex("transactions").insert({
          id: import_node_crypto.default.randomUUID(),
          title,
          amount: type === "credit" ? amount : amount * -1,
          session_id: sessionId
        });
        return reply.status(201).send();
      } catch (err) {
        console.error("ERRO NA TRANSA\xC7\xC3O:", err);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }));
  });
}

// src/app.ts
var import_cookie = __toESM(require("@fastify/cookie"));
var app = (0, import_fastify.default)();
app.register(import_cookie.default);
app.register(transactionsRoutes, {
  prefix: "transactions"
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app
});
