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
exports.LeadController = void 0;
const typedi_1 = require("typedi");
require("reflect-metadata");
const express_1 = require("express");
const leadService_js_1 = require("../services/leadService.js");
const leadModel_js_1 = require("../models/leadModel.js");
const validationHelper_js_1 = require("../common/validator-helper/validationHelper.js");
const generic_response_dto_js_1 = require("../common/dtos/generic-response-dto.js");
let LeadController = class LeadController {
    _leadService;
    router = (0, express_1.Router)();
    constructor(_leadService) {
        this._leadService = _leadService;
        this.setRoutes();
    }
    async setRoutes() {
        this.router.post('/add', (0, validationHelper_js_1.onActionExecution)(), (0, validationHelper_js_1.validationRequest)(leadModel_js_1.LeadModel), this.AddAsync.bind(this));
        this.router.get('/getAll', (0, validationHelper_js_1.onActionExecution)(), this.GetAllAsync.bind(this));
    }
    async AddAsync(req, res) {
        var result = new generic_response_dto_js_1.GenericResponse();
        result.status = true;
        let baseCurve = req.body;
        result.data = await this._leadService.AddAsync(baseCurve);
        result.code = 200;
        res.status(result.code);
        res.send(result);
    }
    async GetAllAsync(req, res) {
        var result = new generic_response_dto_js_1.GenericResponse();
        result.status = true;
        result.data = await this._leadService.GetAllAsync();
        result.code = 200;
        res.status(result.code);
        res.send(result);
    }
};
exports.LeadController = LeadController;
exports.LeadController = LeadController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [leadService_js_1.LeadService])
], LeadController);
