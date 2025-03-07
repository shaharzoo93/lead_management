import { jest } from '@jest/globals';
import { Request, Response } from 'express';
import { CommonController } from '../../controllers/commonController.js';
import { CommonService } from '../../services/commonService.js';
import { GenericResponse } from '../../common/dtos/generic-response-dto.js';

describe('CommonController.ts tests', () => {
  let controller: CommonController;

  // @ts-ignore
  const req: Request = {};
  // @ts-ignore
  const res: Response = {};

  beforeEach(() => {
    let commonServiceMock: CommonService = {
      CreateAllTableIfNotExistAsync: jest.fn().mockImplementation((): Promise<void> => Promise.resolve()),
      DeleteAllTableIfExistAsync: jest.fn().mockImplementation((): Promise<void> => Promise.resolve()),
    } as unknown as CommonService;

    controller = new CommonController(commonServiceMock);
  });

  test(' it Should Create All Tables ', async () => {
    let result: GenericResponse<boolean> = {
      status: true,
      data: true,
      error: '',
      code: 200,
      validationError: [],
    };
    // @ts-ignore
    res.status = jest.fn().mockReturnValue(result.code);
    // @ts-ignore
    res.send = jest.fn().mockReturnValue(res);
    req.params = { responseType: '0' };
    await controller.CreateAllTableAsync(req, res);
    expect(res.send).toHaveBeenCalledWith(result);
  });

  test('it should Delete All Tables', async () => {
    let result: GenericResponse<boolean> = {
      status: true,
      data: true,
      error: '',
      code: 200,
      validationError: [],
    };
    // @ts-ignore
    res.status = jest.fn().mockReturnValue(result.code);
    // @ts-ignore
    res.send = jest.fn().mockReturnValue(res);
    req.params = { responseType: '0' };

    await controller.DeleteAllDatabaseSchemaAsync(req, res);
    expect(res.send).toHaveBeenCalledWith(result);
  });
});
