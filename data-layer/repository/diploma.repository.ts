import { Connection, RowDataPacket } from "mysql2/promise";
import { DatabaseUtils } from "../config/database";
import { Diploma } from "../models/diploma.model";

export class DiplomaRepository{
    private table: string = "diploma";
    private static _connection: Connection;
    private static _instance: DiplomaRepository;

    public static async getInstance(): Promise<DiplomaRepository> {
        if(DiplomaRepository._instance === undefined) {
            DiplomaRepository._instance = new DiplomaRepository();
        }
        return DiplomaRepository._instance;
    }
    
    public async get(id: string): Promise<Diploma[] | null>{
        DiplomaRepository._connection = await DatabaseUtils.getConnection();
        try {  
            const res = await DiplomaRepository._connection.query(`SELECT * FROM ${this.table} WHERE id = "${id}"`);
            const data = res[0];
                if(Array.isArray(data)) {
                    return (data as RowDataPacket[]).map(function(row) {
                        return new Diploma({
                            id: "" + row["id"],
                            providerId: row["providerId"],
                            filename: row["filename"],
                            filePath: row["filePath"],
                            updateAt: row["updateAt"],
                            createdAt: row["createdAt"]
                        });
                    });
                }
            } catch(err) {
                console.error(err); 
            }
        return null;
    }

    public async insert(diploma: Diploma): Promise<Diploma | null> {
        DiplomaRepository._connection = await DatabaseUtils.getConnection();
        try {
            await DiplomaRepository._connection.execute(`INSERT INTO ${this.table} 
                (id, providerId, filename, filePath, createdAt) 
                VALUES (?, ?, ?, ?, ?)`, [
                diploma.id,
                diploma.providerId,
                diploma.filename,
                diploma.filePath,
                diploma.createdAt
            ]);
            return new Diploma({
                ...diploma
            });
        } catch(err) {
            console.error(err); 
            return null;
        }
    }

    public async update(id: string, diploma: Diploma): Promise<Diploma | null> {
        DiplomaRepository._connection = await DatabaseUtils.getConnection();
        try {
            diploma.updateAt = new Date();
            await DiplomaRepository._connection.execute(`UPDATE ${this.table} 
            SET providerId=?, filename=?, filePath=?, updateAt=? 
            WHERE id = "${id}"`, [
                diploma.providerId,
                diploma.filename,
                diploma.filePath,
                diploma.updateAt
            ]);
            return new Diploma(diploma);
        } catch(err) {
            console.error(err); 
            return null;
        }
    }

    public async delete(id: string): Promise<string | null> {
        DiplomaRepository._connection = await DatabaseUtils.getConnection();
        try {
             await DiplomaRepository._connection.query(`DELETE FROM ${this.table} WHERE id = "${id}"`);        
             return id;
        } catch(err) {
            console.error(err); 
            return null;
        }
    }
}
