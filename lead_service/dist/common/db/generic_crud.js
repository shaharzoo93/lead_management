"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const datahelper_js_1 = __importDefault(require("./datahelper.js"));
class DBGeneric extends datahelper_js_1.default {
    constructor() {
        super();
    }
    async GenericCreateDataBaseAsync(pool, database_name) {
        await this.createDataBaseAsync(pool, database_name);
    }
    async GenericCreateTableAsync(pool, tableName, tableArray) {
        await this.createTableAsync(pool, tableName, tableArray);
    }
    async GenericDropTableAsync(pool, tableName) {
        await this.dropTableAsync(pool, tableName);
    }
    // insert data generic query
    async GenericInsertAsync(pool, tableName, objectToSave) {
        delete objectToSave.row_id;
        const data = Object.values(objectToSave);
        const columnNames = Object.keys(objectToSave).join(',');
        const columnIndex = Object.keys(objectToSave)
            .map((obj, index) => {
            return '$' + (index + 1);
        })
            .join(',');
        var result = await this.insertDataAsync(pool, tableName, columnNames, columnIndex, data);
        return result.rows[0].row_id;
    }
    // update data
    // TODO - Update code to support generic update with model
    async GenericUpdateAsync(pool, tableName, objectToSave) {
        const id = objectToSave.row_id;
        //const ID = row_id; if row_id coming as path parameter
        const data = Object.values(objectToSave);
        const columnNames = Object.keys(objectToSave).join(',');
        const columnIndex = Object.keys(objectToSave)
            .map((obj, index) => {
            return '$' + (index + 1);
        })
            .join(',');
        await this.updateDataAsync(id, pool, tableName, columnNames, columnIndex, data);
    }
    async GenericDeleteAsync(pool, tableName, id) {
        await this.deleteDataAsync(id, pool, tableName);
    }
    // get data from db with input parameter
    async GenericGetQueryAsync(pool, query, arraydata) {
        var result = await this.getDataAsync(pool, query, arraydata);
        return result.rows;
    }
    async GenericDeleteAllAsync(pool, tableName) {
        await this.truncateAsync(tableName, pool);
    }
    async GenericGetAllAsync(pool, tableName) {
        var result = await this.getAllAsync(tableName, pool);
        return result.rows;
    }
    async GenericGetByIdAsync(pool, tableName, id) {
        var result = await this.getByIdAsync(pool, tableName, id);
        return result.rows;
    }
    // TODO - change all the helper return type with model
    async GenericCheckDbExists(pool, dataBaseName) {
        let result = await this.GenericGetQueryAsync(pool, `select exists(
		SELECT datname FROM pg_catalog.pg_database WHERE lower(datname) = lower($1) )`, [dataBaseName]);
        return result[0].exists;
    }
}
exports.default = DBGeneric;
