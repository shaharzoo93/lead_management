import { Pool } from 'pg';

export default class DataHelper {
  constructor() {}

  async createDataBaseAsync(pool: Pool, databaseName: string) {
    var client = await pool.connect();
    try {
      var result = await client.query('CREATE DATABASE ' + databaseName);
      return result;
    } finally {
      client.release();
    }
  }

  // create table
  async createTableAsync(pool: Pool, tableName: string, tableArray: string[]) {
    var client = await pool.connect();
    try {
      var result = await client.query('CREATE TABLE IF NOT EXISTS ' + tableName + ' (' + tableArray.join(',') + ')');
      return result;
    } finally {
      client.release();
    }
  }

  async dropTableAsync(pool: Pool, tableName: string) {
    var client = await pool.connect();
    try {
      var result = await client.query('DROP TABLE IF EXISTS ' + tableName);
      return result;
    } finally {
      client.release();
    }
  }

  /// insert data into db
  async insertDataAsync(pool: Pool, tableName: string, keys: string, argKeys: string, data: any) {
    var client = await pool.connect();
    try {
      const queryText =
        'INSERT INTO ' + tableName + ' (' + keys + ') VALUES ' + '(' + argKeys + ') ' + 'RETURNING row_id';
      var result = await client.query(queryText, data);
      return result;
    } finally {
      client.release();
    }
  }

  // update existing  data into DB
  async updateDataAsync(ID: string, pool: Pool, tableName: string, keys: string, argKeys: string, data: any) {
    var client = await pool.connect();
    try {
      const query = 'UPDATE ' + tableName + ' SET (' + keys + ') = (' + argKeys + ') WHERE row_id = ' + ID;
      var result = await client.query(query, data);
      return result;
    } finally {
      client.release();
    }
  }

  // delete data
  async deleteDataAsync(id: number, pool: Pool, tableName: string) {
    var client = await pool.connect();
    try {
      const textquery = 'DELETE FROM ' + tableName + ' WHERE row_id= ' + id;
      var result = await client.query(textquery);
      return result;
    } finally {
      client.release();
    }
  }

  async getDataAsync(pool: Pool, query: string, arraydata: any) {
    var client = await pool.connect();
    try {
      var result = await client.query(query, arraydata);
      return result;
    } finally {
      client.release();
    }
  }

  async truncateAsync(tableName: string, pool: Pool) {
    var client = await pool.connect();
    try {
      const textquery = 'DELETE FROM ' + tableName; //+ " RESTART IDENTITY";
      // TODO - Idenity reset should be logic add here
      var result = await client.query(textquery);
      return result;
    } finally {
      client.release();
    }
  }

  async getAllAsync(tableName: string, pool: Pool) {
    var client = await pool.connect();
    try {
      const textquery = 'SELECT * FROM ' + tableName;
      var result = await client.query(textquery);
      return result;
    } finally {
      client.release();
    }
  }

  async getByIdAsync(pool: Pool, tableName: string, id: number) {
    var client = await pool.connect();
    try {
      const textquery = 'SELECT * FROM ' + tableName + ' WHERE row_id= ' + id;
      var result = await client.query(textquery);
      return result;
    } finally {
      client.release();
    }
  }
}
