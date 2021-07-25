import { Connection, RowDataPacket } from "mysql2/promise";
import { DatabaseUtils } from "../../../config/database";
import { Provider } from "../model/provider.model";

export class ProviderRepository{
    private table: string = "provider";
    private static _connection: Connection | null;
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
            if(ProviderRepository._connection){
                const res = await ProviderRepository._connection.query(`SELECT * FROM ${this.table}`);
                const data = res[0];
                    if(Array.isArray(data)) {
                        return (data as RowDataPacket[]).map(function(row) {
                            return new Provider({
                                id: "" + row["id"],
                                userId: row["userId"],
                                description: row["description"],
                                updateAt: row["updateAt"],
                                createdAt: row["createdAt"]
                            });
                        });
                    }
            }
        } catch(err) {
            console.error(err); 
        }
        return null;
    }

    public async getOne(userId: string): Promise<Provider | null> {
        ProviderRepository._connection = await DatabaseUtils.getConnection();
        try {  
            if(ProviderRepository._connection){
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
                            updateAt: row["updateAt"],
                            createdAt: row["createdAt"]
                        });
                    }
                    }
            }
        } catch(err) {
            console.error(err); 
        }
        return null;
    }

    public async checkProviderExist(providerId: string): Promise<string | null> {
        ProviderRepository._connection = await DatabaseUtils.getConnection();
        try {  
            if(ProviderRepository._connection){
                const res = await ProviderRepository._connection.query(`SELECT * FROM ${this.table} WHERE id = "${providerId}"`);
                const data = res[0];
                if(Array.isArray(data)) {
                    const rows = data as RowDataPacket[];
                    if(rows.length > 0) {
                        const row = rows[0];
                            return row["id"];
                    }
                }
            }
        } catch(err) {
            console.error(err); 
        }
        return null;
    }

    public async insert(provider: Provider): Promise<Provider | null> {
        ProviderRepository._connection = await DatabaseUtils.getConnection();
        try {
            if(ProviderRepository._connection){
                provider.createdAt = new Date();
                await ProviderRepository._connection.execute(`INSERT INTO ${this.table} 
                    (id, userId, description, createdAt) 
                    VALUES (?, ?, ?, ?)`, [
                    provider.id,
                    provider.userId,
                    provider.description,
                    provider.createdAt
                ]);
                return new Provider({
                    ...provider
                });
            }
        } catch(err) {
            console.error(err); 
        }
        return null;
    }

    public async update(id: string, provider: Provider): Promise<Provider | null> {
        ProviderRepository._connection = await DatabaseUtils.getConnection();
        try {
            if(ProviderRepository._connection){
                provider.updateAt = new Date();
                await ProviderRepository._connection.execute(`UPDATE ${this.table} 
                SET userId=?, description=?, updateAt=? 
                WHERE id = "${id}"`, [
                    provider.userId,
                    provider.description,
                    provider.updateAt
                ]);
                return new Provider(provider);
            }
        } catch(err) {
            console.error(err); 
        }
        return null;
    }

    public async verifyProvider(userId: string, verified: boolean | null): Promise<boolean | null> {
        ProviderRepository._connection = await DatabaseUtils.getConnection();
        try {
            if(ProviderRepository._connection){
                await ProviderRepository._connection.execute(`UPDATE ${this.table} 
                SET verified=? WHERE userId = "${userId}"`, [
                    verified
                ]);
                return verified;
            }
        } catch(err) {
            console.error(err); 
        }
        return null;
    }

    public async delete(id: string): Promise<string | null> {
        ProviderRepository._connection = await DatabaseUtils.getConnection();
        try {
            if(ProviderRepository._connection){
                await ProviderRepository._connection.query(`DELETE FROM ${this.table} WHERE id = "${id}"`);        
                return id;
            }
        } catch(err) {
            console.error(err); 
        }
        return null;
    }
}
