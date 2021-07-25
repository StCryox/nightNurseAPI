import {v4 as uuidv4} from 'uuid'
import { Connection, RowDataPacket } from "mysql2/promise";
import { DatabaseUtils } from '../../config/database';
import { Booking } from './booking.model';

export class BookingRepository{
    private table: string = "booking";
    private static _connection: Connection | null;
    private static _instance: BookingRepository;

    public static async getInstance(): Promise<BookingRepository> {
        if(BookingRepository._instance === undefined) {
            BookingRepository._instance = new BookingRepository();
        }
        return BookingRepository._instance;
    }
    
    public async getAll(): Promise<Booking[] | null>{
        BookingRepository._connection = await DatabaseUtils.getConnection();
        try {  
            if(BookingRepository._connection){
                const res = await BookingRepository._connection.query(`SELECT * FROM ${this.table}`);
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
            }
        } catch(err) {
            console.error(err); 
        }
        return null;
    }

    public async getAllById(userId: string): Promise<Booking[] | null>{
        BookingRepository._connection = await DatabaseUtils.getConnection();
        try {  
            if(BookingRepository._connection){
                const res = await BookingRepository._connection.query(`SELECT * FROM ${this.table} WHERE userId = "${userId}"`);
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
            }
        } catch(err) {
            console.error(err); 
        }
        return null;
    }

    public async getOne(id: string): Promise<Booking | null> {
        BookingRepository._connection = await DatabaseUtils.getConnection();
        try{
            if(BookingRepository._connection){
                const res = await BookingRepository._connection.query(`SELECT * FROM ${this.table} WHERE id = "${id}"`);
                const data = res[0];
                if(Array.isArray(data)) {
                    const rows = data as RowDataPacket[];
                    if(rows.length > 0) {
                        const row = rows[0];
                        return new Booking({
                            id: "" + row["id"],
                            userId: row["userId"],
                            providerId: row["providerId"],
                            date: row["date"],
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

    public async insert(booking: Booking): Promise<Booking | null> {
        BookingRepository._connection = await DatabaseUtils.getConnection();
        try {
            if(BookingRepository._connection){
                await BookingRepository._connection.execute(`INSERT INTO ${this.table} 
                    (id, userId, providerId, date, updateAt, createdAt) 
                    VALUES (?, ?, ?, ?, ?, ?)`, [
                    uuidv4(),
                    booking.userId,
                    booking.providerId,
                    booking.date,
                    new Date(),
                    new Date()
                ]);
                return new Booking({
                    ...booking
                });
            }
        } catch(err) {
            console.error(err);
        }
        return null;
    }

    public async update(id: string, booking: Booking): Promise<Booking | null> {
        BookingRepository._connection = await DatabaseUtils.getConnection();
        try {
            if(BookingRepository._connection){
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
            }
        } catch(err) {
            console.error(err); 
        }
        return null;
    }

    public async delete(id: string): Promise<string | null> {
        BookingRepository._connection = await DatabaseUtils.getConnection();
        try {
            if(BookingRepository._connection){
                await BookingRepository._connection.query(`DELETE FROM ${this.table} WHERE id = "${id}"`);        
                return id;
            }
        } catch(err) {
            console.error(err); 
        }
        return null;
    }
}
