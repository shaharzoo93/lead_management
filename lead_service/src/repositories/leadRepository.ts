import { Service } from 'typedi';
import { DBConnection } from '../config/db/connect.js';
import { LeadModel } from '../models/leadModel.js';
import { DBBaseRepository } from '../common/db/repository/base-repository.js';

@Service()
export class LeadRepository extends DBBaseRepository {
  tableName = 'lead';
  tableArray = [
    'row_id SERIAL NOT NULL PRIMARY KEY',
    'name VARCHAR(200) NOT NULL',
    'email_address VARCHAR(200) NOT NULL',
    'status VARCHAR(200) NOT NULL',
    'created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
  ];

  CreateTableAsync = async (): Promise<void> => {
    await this.GenericCreateTableAsync(DBConnection.GetDBPool(), this.tableName, this.tableArray);
  };

  GetAllAsync = async (): Promise<LeadModel[]> => {
    return await this.GenericGetAllAsync(DBConnection.GetDBPool(), this.tableName);
  };

  InsertAsync = async (model: LeadModel): Promise<number> => {
    delete model['row_id'];
    let result = await this.GenericInsertAsync(DBConnection.GetDBPool(), this.tableName, model);
    return result;
  };
  DropTableAsync = async (): Promise<void> => {
    await this.GenericDropTableAsync(DBConnection.GetDBPool(), this.tableName);
  };

  DeleteAllAsync = async (): Promise<void> => {
    await this.GenericDeleteAllAsync(DBConnection.GetDBPool(), this.tableName);
  };
}
