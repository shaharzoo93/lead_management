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
exports.LeadService = void 0;
const typedi_1 = require("typedi");
const leadRepository_js_1 = require("../repositories/leadRepository.js");
let LeadService = class LeadService {
    _leadRepository;
    constructor(_leadRepository) {
        this._leadRepository = _leadRepository;
    }
    GetAllAsync = async () => {
        return this._leadRepository.GetAllAsync();
    };
    AddAsync = async (model) => {
        return await this._leadRepository.InsertAsync(model);
    };
};
exports.LeadService = LeadService;
exports.LeadService = LeadService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [leadRepository_js_1.LeadRepository])
], LeadService);
