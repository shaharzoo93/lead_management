"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBConnection = void 0;
const pg_1 = __importDefault(require("pg"));
const { Pool } = pg_1.default;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: '.env' });
class DBConnection {
    static Pool;
    static GetDBPool() {
        if (DBConnection.Pool) {
            return DBConnection.Pool;
        }
        let credentials = {
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.PG_PORT || '5432'),
            user: process.env.POSTGRES_USER || 'postgres',
            password: process.env.POSTGRES_PASSWORD || '08dee101',
            database: process.env.POSTGRES_DB || 'postgres',
        };
        DBConnection.Pool = new Pool(credentials);
        return DBConnection.Pool;
    }
}
exports.DBConnection = DBConnection;
