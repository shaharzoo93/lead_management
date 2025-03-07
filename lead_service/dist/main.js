"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = __importDefault(require("./app.js"));
const PORT = process.env.PORT || 4000;
const REQUEST_TIMEOUT = process.env.REQUEST_TIMEOUT || 120000;
const server = app_js_1.default.listen(PORT, () => console.log(`Listening on port ${PORT}${new Date()}`));
server.requestTimeout = REQUEST_TIMEOUT;
