"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/routes/transactions.ts
var transactions_exports = {};
__export(transactions_exports, {
  transactionsRoute: () => transactionsRoute
});
module.exports = __toCommonJS(transactions_exports);
var import_zod2 = require("zod");

// src/database.ts
var import_knex = require("knex");

// src/env/index.ts
var import_dotenv = require("dotenv");
var import_zod = require("zod");
if (process.env.NODE_ENV === "test") {
  (0, import_dotenv.config)({ path: ".env.test" });
} else {
  (0, import_dotenv.config)();
}
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: import_zod.z.string(),
  PORT: import_zod.z.number().default(3333)
});
var _env = envSchema.safeParse(process.env);
if (_env.success === false) {
  console.error("\u26A0\uFE0F invalid environment variable!", _env.error.format());
  throw new Error("Invalid environment variable.");
}
var env = _env.data;

// src/database.ts
var config2 = {
  client: "sqlite",
  connection: {
    filename: env.DATABASE_URL
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations"
  }
};
var knex = (0, import_knex.knex)(config2);

// src/routes/transactions.ts
var import_node_crypto = require("crypto");

// src/middlewares/check-session-id-exist.ts
async function CheckSessionIdExists(request, reply) {
  const SessionId = request.cookies.SessionId;
  if (!SessionId) {
    return reply.status(401).send({ error: "Unauthorized" });
  }
}

// src/routes/transactions.ts
async function transactionsRoute(app) {
  app.get("/", {
    preHandler: [CheckSessionIdExists]
  }, async (request) => {
    const { SessionId } = request.cookies;
    const transactions = await knex("transactions").where("session_id", SessionId).select();
    return { transactions };
  });
  app.get("/:id", {
    preHandler: [CheckSessionIdExists]
  }, async (request) => {
    const getTransactionParamsSchema = import_zod2.z.object({
      id: import_zod2.z.string().uuid()
    });
    const { SessionId } = request.cookies;
    const { id } = getTransactionParamsSchema.parse(request.params);
    const transaction = await knex("transactions").where({
      session_id: SessionId,
      id
    }).first();
    return { transaction };
  });
  app.get("/summary", {
    preHandler: [CheckSessionIdExists]
  }, async (request) => {
    const { SessionId } = request.cookies;
    const summary = await knex("transactions").where("session_id", SessionId).sum("amount", { as: "Amount" }).first();
    return { summary };
  });
  app.post("/", {
    preHandler: [CheckSessionIdExists]
  }, async (request, replay) => {
    const createTransactionSchema = import_zod2.z.object({
      title: import_zod2.z.string(),
      amount: import_zod2.z.number(),
      type: import_zod2.z.enum(["credit", "debit"])
    });
    const { title, amount, type } = createTransactionSchema.parse(request.body);
    let SessionId = request.cookies.SessionId;
    if (!SessionId) {
      SessionId = (0, import_node_crypto.randomUUID)();
      replay.cookie("SessionId", SessionId, {
        path: "/",
        maxAge: 1e3 * 60 * 60 * 24 * 7
        // 7 days
      });
    }
    await knex("transactions").insert({
      id: (0, import_node_crypto.randomUUID)(),
      title,
      amount: type === "credit" ? amount : amount * -1,
      session_id: SessionId
    });
    return replay.status(201).send();
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  transactionsRoute
});
