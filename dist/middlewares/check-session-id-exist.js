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

// src/middlewares/check-session-id-exist.ts
var check_session_id_exist_exports = {};
__export(check_session_id_exist_exports, {
  CheckSessionIdExists: () => CheckSessionIdExists
});
module.exports = __toCommonJS(check_session_id_exist_exports);
async function CheckSessionIdExists(request, reply) {
  const SessionId = request.cookies.SessionId;
  if (!SessionId) {
    return reply.status(401).send({ error: "Unauthorized" });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CheckSessionIdExists
});
