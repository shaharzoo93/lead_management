"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonService = void 0;
const typedi_1 = require("typedi");
const dotenv_1 = require("dotenv");
const leadRepository_1 = require("../repositories/leadRepository");
(0, dotenv_1.config)({ path: '.env' });
let CommonService = class CommonService {
    _leadRepository;
    constructor(_leadRepository) {
        this._leadRepository = _leadRepository;
    }
    CreateAllTableIfNotExistAsync = async () => {
        await this._leadRepository.CreateTableAsync();
    };
    DeleteAllTableIfExistAsync = async (dropTable = false) => {
        if (dropTable.toString() == 'true') {
            await this.DropAllTableAsync();
        }
        else {
            await this.DeleteAllAsync();
            await this.CreateAllTableIfNotExistAsync();
        }
    };
    DropAllTableAsync = async () => {
        await this._leadRepository.DropTableAsync();
    };
    DeleteAllAsync = async () => {
        await this._leadRepository.DeleteAllAsync();
    };
};
exports.CommonService = CommonService;
exports.CommonService = CommonService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [leadRepository_1.LeadRepository])
], CommonService);
