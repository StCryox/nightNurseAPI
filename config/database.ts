import {Connection, createConnection} from 'mysql2/promise';

export class DatabaseUtils {

    private static _connection?: Connection;

    public static async getConnection(): Promise<Connection | null> {
        try{
            if(!DatabaseUtils._connection) {
                DatabaseUtils._connection = await createConnection({
                });
            }
            return DatabaseUtils._connection;
        } catch(err) {
            console.error(err); 
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'nightnurse',
                port: 3306
        }
        return null;
    }
}