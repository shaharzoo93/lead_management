"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = __importDefault(require("pg"));
const { Pool } = pg_1.default;
class DatabseUtil {
    static dbObjects = [];
    static GetConnection(dbObject) {
        let dbDetails = DatabseUtil.dbObjects?.find((x) => x.database == dbObject.db_name);
        if (dbDetails)
            return dbDetails.pool;
        dbObject.database = dbObject.db_name;
        let credentials = {
            host: dbObject.db_host,
            port: dbObject.db_port,
            user: dbObject.db_user_name,
            password: dbObject.db_password,
            database: dbObject.db_name
        };
        let pool = new Pool(credentials);
        dbObject.pool = pool;
        DatabseUtil.dbObjects.push(dbObject);
        return pool;
    }
    ;
}
exports.default = DatabseUtil;
