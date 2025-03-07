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
exports.CommonController = void 0;
const typedi_1 = require("typedi");
require("reflect-metadata");
const commonService_js_1 = require("../services/commonService.js");
const express_1 = require("express");
const validationHelper_js_1 = require("../common/validator-helper/validationHelper.js");
const generic_response_dto_js_1 = require("../common/dtos/generic-response-dto.js");
const requestValidatorDataTypeEnum_js_1 = require("../common/utils/constant/validator/requestValidatorDataTypeEnum.js");
let CommonController = class CommonController {
    _commonService;
    router = (0, express_1.Router)();
    constructor(_commonService) {
        this._commonService = _commonService;
        this.setRoutes();
    }
    async setRoutes() {
        this.router.delete('/deleteAllDatabaseSchema/:dropTable?', (0, validationHelper_js_1.onActionExecution)(), this.DeleteAllDatabaseSchemaAsync.bind(this));
        this.router.post('/createAllTable', (0, validationHelper_js_1.onActionExecution)(), this.CreateAllTableAsync.bind(this));
    }
    async CreateAllTableAsync(req, res) {
        var result = new generic_response_dto_js_1.GenericResponse();
        this.CreateAllTableIfNotExistAsync();
        result.status = true;
        result.data = true;
        result.code = 200;
        res.status(result.code);
        res.send(result);
    }
    async DeleteAllDatabaseSchemaAsync(req, res) {
        let result = new generic_response_dto_js_1.GenericResponse();
        const validationConfigs = [
            {
                propertyName: 'dropTable',
                value: req.params.dropTable,
                type: requestValidatorDataTypeEnum_js_1.ValidatorDataTypeEnum.Boolean,
                isOptional: true,
            },
        ];
        const [isValid, errorMessages] = await (0, validationHelper_js_1.ValidateProperty)(validationConfigs);
        if (!isValid) {
            result.code = 422;
            result.status = false;
            result.validationError = errorMessages;
        }
        else {
            await this._commonService.DeleteAllTableIfExistAsync(req.params.dropTable);
            result.status = true;
            result.data = true;
            result.code = 200;
        }
        res.status(result.code);
        res.send(result);
    }
    async CreateAllTableIfNotExistAsync() {
        await this._commonService.CreateAllTableIfNotExistAsync();
    }
};
exports.CommonController = CommonController;
exports.CommonController = CommonController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [commonService_js_1.CommonService])
], CommonController);
