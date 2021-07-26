import { Connection, RowDataPacket } from "mysql2/promise";
import { DatabaseUtils } from "../../../config/database";
import { Pricing } from "../model/pricing.model";

export class PricingRepository{
    private table: string = "pricing";
    private static _connection: Connection | null;
    private static _instance: PricingRepository;

    public static async getInstance(): Promise<PricingRepository> {
        if(PricingRepository._instance === undefined) {
            PricingRepository._instance = new PricingRepository();
        }
        return PricingRepository._instance;
    }
    
    public async getAllOfPricing(providerId: string | undefined): Promise<Pricing[] | null>{
        PricingRepository._connection = await DatabaseUtils.getConnection();
        try {  
            if(PricingRepository._connection && providerId !== undefined){
                const res = await PricingRepository._connection.query(`SELECT * FROM ${this.table} WHERE providerId = "${providerId}"`);
                const data = res[0];
                    if(Array.isArray(data)) {
                        return (data as RowDataPacket[]).map(function(row) {
                            return new Pricing({
                                id: "" + row["id"],
                                providerId: row["providerId"],
                                date: row["date"],
                                startHour: row["startHour"],
                                endHour: row["endHour"],
                                price: row["price"],
                                hourlyPrice: row["hourlyPrice"],
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

    public async insert(pricing: Pricing): Promise<Pricing | null> {
        PricingRepository._connection = await DatabaseUtils.getConnection();
        try {
            if(PricingRepository._connection){
                await PricingRepository._connection.execute(`INSERT INTO ${this.table} 
                    (id, providerId, date, startHour, endHour, price, hourlyPrice, createdAt) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
                    pricing.id,
                    pricing.providerId,
                    pricing.date,
                    pricing.startHour,
                    pricing.endHour,
                    pricing.price,
                    pricing.hourlyPrice,
                    pricing.createdAt
                ]);
                return new Pricing({
                    ...pricing
                });
            }
        } catch(err) {
            console.error(err); 
        }
        return null;
    }

    public async update(id: string | undefined, pricing: Pricing): Promise<Pricing | null> {
        PricingRepository._connection = await DatabaseUtils.getConnection();
        try {
            if(PricingRepository._connection && id !== undefined){
                pricing.updateAt = new Date();
                await PricingRepository._connection.execute(`UPDATE ${this.table} 
                SET providerId=?, date=?, startHour=?, endHour=?, price=?, hourlyPrice=?, updateAt=? 
                WHERE id = "${id}"`, [
                    pricing.providerId,
                    pricing.date,
                    pricing.startHour,
                    pricing.endHour,
                    pricing.price,
                    pricing.hourlyPrice,
                    pricing.updateAt
                ]);
                return new Pricing(pricing);
            }
        } catch(err) {
            console.error(err); 
        }
        return null;
    }

    public async delete(id: string): Promise<string | null> {
        PricingRepository._connection = await DatabaseUtils.getConnection();
        try {
            if(PricingRepository._connection){
                await PricingRepository._connection.query(`DELETE FROM ${this.table} WHERE id = "${id}"`);        
                return id;
            }
        } catch(err) {
            console.error(err); 
        }
        return null;
    }

    public async getOne(id: string): Promise<Pricing | null> {
        PricingRepository._connection = await DatabaseUtils.getConnection();
        try {
            if(PricingRepository._connection && id !== undefined){
                const res = await PricingRepository._connection.query(`SELECT * FROM ${this.table} WHERE id = "${id}"`);
                const data = res[0];
                if(Array.isArray(data)) {
                    const rows = data as RowDataPacket[];
                    if(rows.length > 0) {
                        const row = rows[0];
                        return new Pricing({
                            id: "" + row["id"],
                            providerId: row["providerId"],
                            date: row["date"],
                            startHour: row["startHour"],
                            endHour: row["endHour"],
                            price: row["price"],
                            hourlyPrice: row["hourlyPrice"],
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

    public async getAllOfPricingWithDate(providerId: string, date: string): Promise<Pricing[] | null> {
        PricingRepository._connection = await DatabaseUtils.getConnection();
        try {
            if(PricingRepository._connection && providerId !== undefined){
                const res = await PricingRepository._connection.query(`SELECT * FROM ${this.table} WHERE providerId = "${providerId}" and date = '${date}'`);
                const data = res[0];
                if(Array.isArray(data)) {
                    return (data as RowDataPacket[]).map(function(row) {
                        return new Pricing({
                            id: "" + row["id"],
                            providerId: row["providerId"],
                            date: row["date"],
                            startHour: row["startHour"],
                            endHour: row["endHour"],
                            price: row["price"],
                            hourlyPrice: row["hourlyPrice"],
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
}
