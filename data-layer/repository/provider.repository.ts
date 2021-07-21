import { Connection, RowDataPacket } from "mysql2/promise";
import { DatabaseUtils } from "../config/database";
import { Provider } from "../models/provider.model";

export class ProviderRepository{
    private table: string = "provider";
    private static _connection: Connection;
    private static _instance: ProviderRepository;

    public static async getInstance(): Promise<ProviderRepository> {
        if(ProviderRepository._instance === undefined) {
            ProviderRepository._instance = new ProviderRepository();
        }
        return ProviderRepository._instance;
    }
    
    public async getAll(): Promise<Provider[] | null>{
        ProviderRepository._connection = await DatabaseUtils.getConnection();
        try {  
            const res = await ProviderRepository._connection.query(`SELECT * FROM ${this.table}`);
            const data = res[0];
                if(Array.isArray(data)) {
                    return (data as RowDataPacket[]).map(function(row) {
                        return new Provider({
                            id: "" + row["id"],
                            userId: row["userId"],
                            description: row["description"],
                            diplomaId: row["diplomaId"],
                            experienceId: row["experienceId"],
                            pricingId: row["pricingId"],
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

    public async getOne(userId: string): Promise<Provider | null> {
        ProviderRepository._connection = await DatabaseUtils.getConnection();
        const res = await ProviderRepository._connection.query(`SELECT * FROM ${this.table} WHERE userId = "${userId}"`);
        const data = res[0];
        if(Array.isArray(data)) {
            const rows = data as RowDataPacket[];
            if(rows.length > 0) {
                const row = rows[0];
                return new Provider({
                    id: "" + row["id"],
                    userId: row["userId"],
                    description: row["description"],
                    diplomaId: row["diploma"],
                    experienceId: row["experience"],
                    pricingId: row["pricing"],
                    updateAt: row["updateAt"],
                    createdAt: row["createdAt"]
                });
            }
        }
        return null;
    }

    public async checkProviderExist(providerId: string): Promise<string | null> {
        ProviderRepository._connection = await DatabaseUtils.getConnection();
        const res = await ProviderRepository._connection.query(`SELECT * FROM ${this.table} WHERE id = "${providerId}"`);
        const data = res[0];
        if(Array.isArray(data)) {
            const rows = data as RowDataPacket[];
            if(rows.length > 0) {
                const row = rows[0];
                    return row["id"];
            }
        }
        return null;
    }

    public async insert(provider: Provider): Promise<Provider | null> {
        ProviderRepository._connection = await DatabaseUtils.getConnection();
        try {
            await ProviderRepository._connection.execute(`INSERT INTO ${this.table} 
                (id, userId, description, diplomaId, experienceId, pricingId, createdAt) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                provider.id,
                provider.userId,
                provider.description,
                provider.diplomaId,
                provider.experienceId,
                provider.pricingId,
                provider.createdAt
            ]);
            return new Provider({
                ...provider
            });
        } catch(err) {
            console.error(err); 
            return null;
        }
    }

    public async update(id: string, provider: Provider): Promise<Provider | null> {
        ProviderRepository._connection = await DatabaseUtils.getConnection();
        try {
            provider.updateAt = new Date();
            await ProviderRepository._connection.execute(`UPDATE ${this.table} 
            SET userId=?, description=?, diplomaId=?, experienceId=?, pricingId=?, updateAt=? 
            WHERE id = "${id}"`, [
                provider.userId,
                provider.description,
                provider.diplomaId,
                provider.experienceId,
                provider.pricingId,
                provider.updateAt
            ]);
            return new Provider(provider);
        } catch(err) {
            console.error(err); 
            return null;
        }
    }

    public async delete(id: string): Promise<string | null> {
        ProviderRepository._connection = await DatabaseUtils.getConnection();
        try {
             await ProviderRepository._connection.query(`DELETE FROM ${this.table} WHERE id = "${id}"`);        
             return id;
        } catch(err) {
            console.error(err); 
            return null;
        }
    }
}
