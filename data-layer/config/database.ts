import {Connection, createConnection} from 'mysql2/promise';

export class DatabaseUtils {

    private static _connection?: Connection;

    public static async getConnection(): Promise<Connection> {
        if(!DatabaseUtils._connection) {
            DatabaseUtils._connection = await createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                port: Number.parseInt(process.env.DB_PORT as string)
            });
        }
        return DatabaseUtils._connection;
    }
}