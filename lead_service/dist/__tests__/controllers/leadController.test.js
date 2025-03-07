"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const leadController_js_1 = require("../../controllers/leadController.js");
const status_enum_js_1 = require("../../enum/status.enum.js");
describe('LeadController.ts tests', () => {
    let controller;
    let leadData = [
        {
            row_id: 1,
            name: 'Lead1',
            email_address: 'a@a.com',
            created_at: new Date(2023, 11, 1),
            status: status_enum_js_1.LeadStatusEnum.New
        },
    ];
    // @ts-ignore
    const req = {};
    // @ts-ignore
    const res = {};
    beforeEach(() => {
        let LeadServiceMock = {
            AddAsync: globals_1.jest.fn().mockImplementation(() => Promise.resolve(1)),
            GetAllAsync: globals_1.jest
                .fn()
                .mockImplementation(() => Promise.resolve(leadData)),
        };
        controller = new leadController_js_1.LeadController(LeadServiceMock);
    });
    test('it should Save Lead  Successfully', async () => {
        let lead = {
            name: 'Lead1',
            email_address: 'a@a.com',
            status: status_enum_js_1.LeadStatusEnum.New
        };
        // @ts-ignore
        req.body = lead;
        let result = {
            status: true,
            data: 1,
            error: '',
            code: 200,
            validationError: [],
        };
        // @ts-ignore
        res.status = globals_1.jest.fn().mockReturnValue(result.code);
        // @ts-ignore
        res.send = globals_1.jest.fn().mockReturnValue(res);
        await controller.AddAsync(req, res);
        expect(res.send).toHaveBeenCalledWith(result);
    });
    test('it should Get All Lead Data', async () => {
        let lead = [
            {
                row_id: 1,
                name: 'Lead1',
                email_address: 'a@a.com',
                created_at: new Date(2023, 11, 1),
                status: status_enum_js_1.LeadStatusEnum.New
            },
        ];
        let result = {
            status: true,
            data: lead,
            error: '',
            code: 200,
            validationError: [],
        };
        // @ts-ignore
        res.status = globals_1.jest.fn().mockReturnValue(result.code);
        // @ts-ignore
        res.send = globals_1.jest.fn().mockReturnValue(res);
        await controller.GetAllAsync(req, res);
        expect(res.send).toHaveBeenCalledWith(result);
    });
});
