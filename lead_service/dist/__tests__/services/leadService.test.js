"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const leadService_js_1 = require("../../services/leadService.js");
const status_enum_js_1 = require("../../enum/status.enum.js");
describe('LeadService.ts tests', () => {
    let service;
    let leadData = [
        {
            row_id: 1,
            name: 'Lead1',
            email_address: 'a@a.com',
            created_at: new Date(2025, 1, 1),
            status: status_enum_js_1.LeadStatusEnum.New
        },
    ];
    beforeEach(() => {
        let LeadRepositoryMock = {
            InsertAsync: globals_1.jest.fn().mockImplementation(() => Promise.resolve(1)),
            GetAllAsync: globals_1.jest.fn().mockImplementation(() => Promise.resolve(leadData)),
        };
        service = new leadService_js_1.LeadService(LeadRepositoryMock);
    });
    it('it should Save Lead Master Successfully', async () => {
        // GIVEN
        let model = {
            name: 'Lead1',
            email_address: 'a@a.com',
            status: status_enum_js_1.LeadStatusEnum.New
        };
        // WHEN
        const tags = await service.AddAsync(model);
        // THEN
        expect(tags).toBe(1);
        expect(tags).toEqual(1);
    });
    it('it should Get All Lead Master Data', async () => {
        // GIVEN
        // WHEN
        const tags = await service.GetAllAsync();
        // THEN
        expect(tags.length).toBe(1);
        expect(tags[0]).toEqual(leadData[0]);
    });
});
