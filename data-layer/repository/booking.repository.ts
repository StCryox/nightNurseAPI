import { Connection, RowDataPacket } from "mysql2/promise";
import { DatabaseUtils } from "../config/database";
import { Booking } from "../models/booking.model";

export class BookingRepository{
    private table: string = "booking";
    private static _connection: Connection;
    private static _instance: BookingRepository;

    public static async getInstance(): Promise<BookingRepository> {
        if(BookingRepository._instance === undefined) {
            BookingRepository._instance = new BookingRepository();
        }
        return BookingRepository._instance;
    }
    
    public async getOne(id: string): Promise<Booking[] | null>{
        BookingRepository._connection = await DatabaseUtils.getConnection();
        try {  
            const res = await BookingRepository._connection.query(`SELECT * FROM ${this.table} WHERE id = "${id}"`);
            const data = res[0];
                if(Array.isArray(data)) {
                    return (data as RowDataPacket[]).map(function(row) {
                        return new Booking({
                            id: "" + row["id"],
                            userId: row["userId"],
                            providerId: row["providerId"],
                            date: row["date"],
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

    public async insert(booking: Booking): Promise<Booking | null> {
        BookingRepository._connection = await DatabaseUtils.getConnection();
        try {
            await BookingRepository._connection.execute(`INSERT INTO ${this.table} 
                (id, usderId, providerId, date, createdAt) 
                VALUES (?, ?, ?, ?, ?)`, [
                booking.id,
                booking.userId,
                booking.providerId,
                booking.date,
                booking.createdAt
            ]);
            return new Booking({
                ...booking
            });
        } catch(err) {
            console.error(err); 
            return null;
        }
    }

    public async update(id: string, booking: Booking): Promise<Booking | null> {
        BookingRepository._connection = await DatabaseUtils.getConnection();
        try {
            booking.updateAt = new Date();
            await BookingRepository._connection.execute(`UPDATE ${this.table} 
            SET usderId=?, providerId=?, date=?, updateAt=? 
            WHERE id = "${id}"`, [
                booking.userId,
                booking.providerId,
                booking.date,
                booking.updateAt
            ]);
            return new Booking(booking);
        } catch(err) {
            console.error(err); 
            return null;
        }
    }

    public async delete(id: string): Promise<string | null> {
        BookingRepository._connection = await DatabaseUtils.getConnection();
        try {
             await BookingRepository._connection.query(`DELETE FROM ${this.table} WHERE id = "${id}"`);        
             return id;
        } catch(err) {
            console.error(err); 
            return null;
        }
    }
}
