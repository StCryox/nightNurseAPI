import { Connection, RowDataPacket } from "mysql2/promise";
import { DatabaseUtils } from "../../../config/database";
import { Session } from "./session.model";
import {v4 as uuidv4} from "uuid";
export class SessionRepository {

    private table = "session";
    private static _connection: Connection;
    private static _instance: SessionRepository;

    public static async getInstance(): Promise<SessionRepository> {
        if(SessionRepository._instance === undefined) {
            SessionRepository._instance = new SessionRepository();
        }
        return SessionRepository._instance;
    }

    public async getOne(token: string): Promise<Session | null> {
        SessionRepository._connection = await DatabaseUtils.getConnection();
        const res = await SessionRepository._connection.query(`SELECT * FROM ${this.table} WHERE token = "${token}"`);
        const data = res[0];
        if(Array.isArray(data)) {
            const rows = data as RowDataPacket[];
            if(rows.length > 0) {
                const row = rows[0];
                return new Session({
                    id: row["id"],
                    token: row["token"],
                    updateAt: row["updateAt"],
                    createdAt: row["createdAt"],
                    userId: row["userId"]
                });
            }
        }
        return null;
    }

    public async insert(session: Session): Promise<Session | null> {
        SessionRepository._connection = await DatabaseUtils.getConnection();
        try {
            console.log("values : " + session.id + " " +
                session.token  + " " +
                Date.now() + " " +
                session.userId)
           await SessionRepository._connection.execute(`INSERT INTO ${this.table} 
                (id, token, createdAt, userId) 
                VALUES (?, ?, ?, ?)`, [
                uuidv4(),
                session.token,
                new Date(),
                session.userId
            ]);
            return new Session({
                ...session
            });
        } catch(err) {
            console.error(err);
            return null;
        }
    }

    public async delete(token: string): Promise<string | null> {
        SessionRepository._connection = await DatabaseUtils.getConnection();
        try {
            await SessionRepository._connection.query(`DELETE FROM ${this.table} WHERE token = "${token}"`);           
            return token;
       } catch(err) {
           console.error(err); 
           return null;
       }
    }
}
