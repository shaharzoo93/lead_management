import pkg from 'pg';
const { Pool } = pkg;

export default class DatabseUtil {
    static dbObjects: any = [];

    static GetConnection(dbObject: { db_name: any; database: any; db_host: any; db_port: any; db_user_name: any; db_password: any; pool: any; }) {
        let dbDetails: any = DatabseUtil.dbObjects?.find((x: { database: any; }) => x.database == dbObject.db_name);
        if (dbDetails)
            return dbDetails.pool;
        dbObject.database = dbObject.db_name;
        let credentials = {
            host: dbObject.db_host,
            port: dbObject.db_port,
            user: dbObject.db_user_name,
            password: dbObject.db_password,
            database: dbObject.db_name
        };

        let pool = new Pool(credentials)

        dbObject.pool = pool;
        DatabseUtil.dbObjects.push(dbObject);
        return pool;
    };
}