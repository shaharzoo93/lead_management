import { jest } from '@jest/globals';
import { Request, Response } from 'express';
import { LeadModel } from '../../models/leadModel.js';
import { LeadService } from '../../services/leadService.js';
import { LeadController } from '../../controllers/leadController.js';
import { GenericResponse } from '../../common/dtos/generic-response-dto.js';
import { LeadStatusEnum } from '../../enum/status.enum.js';

describe('LeadController.ts tests', () => {
  let controller: LeadController;
  let leadData: LeadModel[] = [
    {
      row_id: 1,
      name: 'Lead1',
      email_address: 'a@a.com',
      created_at: new Date(2023, 11, 1),
      status:LeadStatusEnum.New
    },
  ];

  // @ts-ignore
  const req: Request = {};
  // @ts-ignore
  const res: Response = {};

  beforeEach(() => {
    let LeadServiceMock: LeadService = {
      AddAsync: jest.fn().mockImplementation((): Promise<number> => Promise.resolve(1)),      
      GetAllAsync: jest
        .fn()
        .mockImplementation((): Promise<LeadModel[]> => Promise.resolve(leadData)),
    } as unknown as LeadService;

    controller = new LeadController(LeadServiceMock);
  });

  test('it should Save Lead  Successfully', async () => {
    let lead: LeadModel = {
      name: 'Lead1',
      email_address: 'a@a.com',
      status:LeadStatusEnum.New
    };
    // @ts-ignore
    req.body = lead;
    let result: GenericResponse<number> = {
      status: true,
      data: 1,
      error: '',
      code: 200,
      validationError: [],
    };
    // @ts-ignore
    res.status = jest.fn().mockReturnValue(result.code);
    // @ts-ignore
    res.send = jest.fn().mockReturnValue(res);

    await controller.AddAsync(req, res);
    expect(res.send).toHaveBeenCalledWith(result);
  });

  test('it should Get All Lead Data', async () => {
  
    let lead: LeadModel[] = [
      {
        row_id:1,
        name: 'Lead1',
        email_address: 'a@a.com',
        created_at: new Date(2023, 11, 1),
        status:LeadStatusEnum.New
      },
    ];

    let result: GenericResponse<LeadModel[]> = {
      status: true,
      data: lead,
      error: '',
      code: 200,
      validationError: [],
    };
    // @ts-ignore
    res.status = jest.fn().mockReturnValue(result.code);
    // @ts-ignore
    res.send = jest.fn().mockReturnValue(res);

    await controller.GetAllAsync(req, res);
    expect(res.send).toHaveBeenCalledWith(result);
  });

});
