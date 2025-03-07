"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const commonService_js_1 = require("../../services/commonService.js");
describe('CommonService.ts tests', () => {
    let service;
    beforeEach(() => {
        let leadRepositoryMock = {
            DeleteAllAsync: globals_1.jest.fn().mockImplementation(() => Promise.resolve()),
            CreateTableAsync: globals_1.jest.fn().mockImplementation(() => Promise.resolve()),
            DropTableAsync: globals_1.jest.fn().mockImplementation(() => Promise.resolve()),
        };
        service = new commonService_js_1.CommonService(leadRepositoryMock);
    });
    it('it should Create All If not exists', async () => {
        // WHEN
        const tags = await service.CreateAllTableIfNotExistAsync();
        // THEN
        expect(tags).toBeUndefined();
    });
    it('it should Delete Table If Exists', async () => {
        // WHEN
        const tags = await service.DeleteAllTableIfExistAsync(true);
        // THEN
        expect(tags).toBeUndefined();
    });
    it('it should Delete Table Data If Exists', async () => {
        // WHEN
        const tags = await service.DeleteAllTableIfExistAsync();
        // THEN
        expect(tags).toBeUndefined();
    });
});
