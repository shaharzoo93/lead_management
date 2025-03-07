import _ from 'lodash';
import { Service } from 'typedi';
import { config } from 'dotenv';
import { LeadRepository } from '../repositories/leadRepository';
config({ path: '.env' });

@Service()
export class CommonService {
  constructor(
    private _leadRepository: LeadRepository,
  ) {}

  CreateAllTableIfNotExistAsync = async (): Promise<void> => {
    await this._leadRepository.CreateTableAsync();
  };

  DeleteAllTableIfExistAsync = async (dropTable: boolean = false): Promise<void> => {
    if (dropTable.toString() == 'true') {
      await this.DropAllTableAsync();
    } else {
      await this.DeleteAllAsync();
      await this.CreateAllTableIfNotExistAsync();
    }
  };

  private DropAllTableAsync = async (): Promise<void> => {
    await this._leadRepository.DropTableAsync();
  };
  private DeleteAllAsync = async (): Promise<void> => {
    await this._leadRepository.DeleteAllAsync();
  };
}
