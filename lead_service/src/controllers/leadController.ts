import { Service } from 'typedi';
import 'reflect-metadata';
import { Request, Response, Router } from 'express';

import { LeadService } from '../services/leadService.js';
import { LeadModel } from '../models/leadModel.js';
import { onActionExecution, validationRequest } from '../common/validator-helper/validationHelper.js';
import { GenericResponse } from '../common/dtos/generic-response-dto.js';

@Service()
export class LeadController {
  public router = Router();
  constructor(public readonly _leadService: LeadService) {
    this.setRoutes();
  }
  public async setRoutes() {
    
    this.router.post(
      '/add',
      onActionExecution(),
      validationRequest(LeadModel),
      this.AddAsync.bind(this),
    );

    this.router.get('/getAll', onActionExecution(), this.GetAllAsync.bind(this));
  }

  async AddAsync(req: Request, res: Response) {
    var result = new GenericResponse<number>();    
    result.status = true;
    let baseCurve: LeadModel = req.body;
    result.data = await this._leadService.AddAsync(baseCurve);
    result.code = 200;   
    res.status(result.code);
    res.send(result);
  }

  async GetAllAsync(req: Request, res: Response) {
    var result = new GenericResponse<LeadModel[]>();
    result.status = true;
    result.data = await this._leadService.GetAllAsync();
    result.code = 200;   
    res.status(result.code);
    res.send(result);
  }
}
