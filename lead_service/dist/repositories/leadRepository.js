"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadRepository = void 0;
const typedi_1 = require("typedi");
const connect_js_1 = require("../config/db/connect.js");
const base_repository_js_1 = require("../common/db/repository/base-repository.js");
let LeadRepository = class LeadRepository extends base_repository_js_1.DBBaseRepository {
    tableName = 'lead';
    tableArray = [
        'row_id SERIAL NOT NULL PRIMARY KEY',
        'name VARCHAR(200) NOT NULL',
        'email_address VARCHAR(200) NOT NULL',
        'status VARCHAR(200) NOT NULL',
        'created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
    ];
    CreateTableAsync = async () => {
        await this.GenericCreateTableAsync(connect_js_1.DBConnection.GetDBPool(), this.tableName, this.tableArray);
    };
    GetAllAsync = async () => {
        return await this.GenericGetAllAsync(connect_js_1.DBConnection.GetDBPool(), this.tableName);
    };
    InsertAsync = async (model) => {
        delete model['row_id'];
        let result = await this.GenericInsertAsync(connect_js_1.DBConnection.GetDBPool(), this.tableName, model);
        return result;
    };
    DropTableAsync = async () => {
        await this.GenericDropTableAsync(connect_js_1.DBConnection.GetDBPool(), this.tableName);
    };
    DeleteAllAsync = async () => {
        await this.GenericDeleteAllAsync(connect_js_1.DBConnection.GetDBPool(), this.tableName);
    };
};
exports.LeadRepository = LeadRepository;
exports.LeadRepository = LeadRepository = __decorate([
    (0, typedi_1.Service)()
], LeadRepository);
