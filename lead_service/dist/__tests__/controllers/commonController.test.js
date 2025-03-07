"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const commonController_js_1 = require("../../controllers/commonController.js");
describe('CommonController.ts tests', () => {
    let controller;
    // @ts-ignore
    const req = {};
    // @ts-ignore
    const res = {};
    beforeEach(() => {
        let commonServiceMock = {
            CreateAllTableIfNotExistAsync: globals_1.jest.fn().mockImplementation(() => Promise.resolve()),
            DeleteAllTableIfExistAsync: globals_1.jest.fn().mockImplementation(() => Promise.resolve()),
        };
        controller = new commonController_js_1.CommonController(commonServiceMock);
    });
    test(' it Should Create All Tables ', async () => {
        let result = {
            status: true,
            data: true,
            error: '',
            code: 200,
            validationError: [],
        };
        // @ts-ignore
        res.status = globals_1.jest.fn().mockReturnValue(result.code);
        // @ts-ignore
        res.send = globals_1.jest.fn().mockReturnValue(res);
        req.params = { responseType: '0' };
        await controller.CreateAllTableAsync(req, res);
        expect(res.send).toHaveBeenCalledWith(result);
    });
    test('it should Delete All Tables', async () => {
        let result = {
            status: true,
            data: true,
            error: '',
            code: 200,
            validationError: [],
        };
        // @ts-ignore
        res.status = globals_1.jest.fn().mockReturnValue(result.code);
        // @ts-ignore
        res.send = globals_1.jest.fn().mockReturnValue(res);
        req.params = { responseType: '0' };
        await controller.DeleteAllDatabaseSchemaAsync(req, res);
        expect(res.send).toHaveBeenCalledWith(result);
    });
});
