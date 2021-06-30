import {v4 as uuidv4} from 'uuid'

export interface IBooking {
    id?: string;
    userId: string;
    providerId: string;
    date: Date;
    updateAt?: Date;
    createdAt?: Date;
}

export class Booking implements IBooking {
    id?: string;
    userId: string;
    providerId: string;
    date: Date;
    updateAt?: Date;
    createdAt?: Date;

    constructor(booking: Booking) {
        this.id = uuidv4();
        this.userId = booking.userId;
        this.providerId = booking.providerId;
        this.date = booking.date;
        this.updateAt = booking.updateAt;
        this.createdAt = new Date();
    }
}