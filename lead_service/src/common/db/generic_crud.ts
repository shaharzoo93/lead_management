import { Pool } from 'pg';
import DataHelper from './datahelper.js';

export default class DBGeneric extends DataHelper {
  constructor() {
    super();
  }

  async GenericCreateDataBaseAsync(pool: Pool, database_name: string): Promise<void> {
    await this.createDataBaseAsync(pool, database_name);
  }

  async GenericCreateTableAsync(pool: Pool, tableName: string, tableArray: string[]): Promise<void> {
    await this.createTableAsync(pool, tableName, tableArray);
  }

  async GenericDropTableAsync(pool: Pool, tableName: string) {
    await this.dropTableAsync(pool, tableName);
  }

  // insert data generic query
  async GenericInsertAsync<T>(pool: Pool, tableName: string, objectToSave: T): Promise<number> {
    delete (<any>objectToSave).row_id;
    const data = Object.values(objectToSave as any);
    const columnNames = Object.keys(objectToSave as any).join(',');
    const columnIndex = Object.keys(objectToSave as any)
      .map((obj, index) => {
        return '$' + (index + 1);
      })
      .join(',');
    var result = await this.insertDataAsync(pool, tableName, columnNames, columnIndex, data);

    return result.rows[0].row_id;
  }

  // update data
  // TODO - Update code to support generic update with model
  async GenericUpdateAsync<T>(pool: Pool, tableName: string, objectToSave: T): Promise<void> {
    const id = (<any>objectToSave).row_id;
    //const ID = row_id; if row_id coming as path parameter
    const data = Object.values(objectToSave as any);
    const columnNames = Object.keys(objectToSave as any).join(',');
    const columnIndex = Object.keys(objectToSave as any)
      .map((obj, index) => {
        return '$' + (index + 1);
      })
      .join(',');
    await this.updateDataAsync(id, pool, tableName, columnNames, columnIndex, data);
  }

  async GenericDeleteAsync(pool: Pool, tableName: string, id: number) {
    await this.deleteDataAsync(id, pool, tableName);
  }

  // get data from db with input parameter
  async GenericGetQueryAsync<S, T>(pool: Pool, query: string, arraydata: S) {
    var result = await this.getDataAsync(pool, query, arraydata);
    return result.rows as T;
  }

  async GenericDeleteAllAsync<T>(pool: Pool, tableName: string): Promise<void> {
    await this.truncateAsync(tableName, pool);
  }

  async GenericGetAllAsync<T>(pool: Pool, tableName: string): Promise<T> {
    var result = await this.getAllAsync(tableName, pool);
    return result.rows as T;
  }

  async GenericGetByIdAsync<T>(pool: Pool, tableName: string, id: number) {
    var result = await this.getByIdAsync(pool, tableName, id);
    return result.rows as T;
  }

  // TODO - change all the helper return type with model
  async GenericCheckDbExists(pool: Pool, dataBaseName: string): Promise<boolean> {
    let result = await this.GenericGetQueryAsync<string[], any>(
      pool,
      `select exists(
		SELECT datname FROM pg_catalog.pg_database WHERE lower(datname) = lower($1) )`,
      [dataBaseName],
    );

    return result[0].exists;
  }
}
