import { Service } from 'typedi';
import { LeadModel } from '../models/leadModel.js';
import { LeadRepository } from '../repositories/leadRepository.js';
@Service()
export class LeadService {
  constructor(
    private readonly _leadRepository: LeadRepository,
  ) {}

  GetAllAsync = async (): Promise<LeadModel[]> => {
    return this._leadRepository.GetAllAsync();
  };

  AddAsync = async (model: LeadModel): Promise<number> => {    
    return await this._leadRepository.InsertAsync(model);
  };

}
