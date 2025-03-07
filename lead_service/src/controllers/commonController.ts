import { Service } from 'typedi';
import 'reflect-metadata';
import { CommonService } from '../services/commonService.js';
import { Request, Response, Router } from 'express';
import { onActionExecution, ValidateProperty } from '../common/validator-helper/validationHelper.js';
import { GenericResponse } from '../common/dtos/generic-response-dto.js';
import { ValidationConfigDto } from '../common/dtos/validationDto.js';
import { ValidatorDataTypeEnum } from '../common/utils/constant/validator/requestValidatorDataTypeEnum.js';


@Service()
export class CommonController {
  public router = Router();
  constructor(private readonly _commonService: CommonService) {
    this.setRoutes();
  }

  public async setRoutes() {
   this.router.delete(
      '/deleteAllDatabaseSchema/:dropTable?',
      onActionExecution(),
      this.DeleteAllDatabaseSchemaAsync.bind(this),
    );

    this.router.post('/createAllTable', onActionExecution(), this.CreateAllTableAsync.bind(this));
  }

  public async CreateAllTableAsync(req: Request, res: Response): Promise<void> {
    var result = new GenericResponse<boolean>();
    
    this.CreateAllTableIfNotExistAsync();
      result.status = true;
      result.data = true;
      result.code = 200;
   
    res.status(result.code);
    res.send(result);
  }

  async DeleteAllDatabaseSchemaAsync(req: Request, res: Response): Promise<void> {
    let result = new GenericResponse<boolean>();
    const validationConfigs: ValidationConfigDto[] = [
      {
        propertyName: 'dropTable',
        value: req.params.dropTable,
        type: ValidatorDataTypeEnum.Boolean,
        isOptional: true,
      },
    ];

    const [isValid, errorMessages] = await ValidateProperty(validationConfigs);
    if (!isValid) {
      result.code = 422;
      result.status = false;
      result.validationError = errorMessages;
    } else {
      await this._commonService.DeleteAllTableIfExistAsync(<boolean>(<unknown>req.params.dropTable));
      result.status = true;
      result.data = true;
      result.code = 200;
    }
    res.status(result.code);
    res.send(result);
  }

  public async CreateAllTableIfNotExistAsync(): Promise<void>{
    await this._commonService.CreateAllTableIfNotExistAsync();
  }
}
