"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBBaseRepository = void 0;
const generic_crud_js_1 = __importDefault(require("../generic_crud.js"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: '/app/dev.env' });
class DBBaseRepository extends generic_crud_js_1.default {
    constructor() {
        super();
    }
}
exports.DBBaseRepository = DBBaseRepository;
