import pkg from 'pg';
const { Pool } = pkg;
import { config } from 'dotenv';
config({ path: '.env' });

export class DBConnection {
  static Pool: pkg.Pool;
  static GetDBPool() {
    if (DBConnection.Pool) {
      return DBConnection.Pool;
    }
    let credentials = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.PG_PORT || '5432'),
      user: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || '08dee101',
      database: process.env.POSTGRES_DB || 'postgres',
    };
    DBConnection.Pool = new Pool(credentials);
    return DBConnection.Pool;
  }
}
