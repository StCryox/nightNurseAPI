export interface IBooking {
    id?: string;
    userId: string;
    providerId: string;
    date: Date;
    pricingId: string;
    updateAt?: Date;
    createdAt?: Date;
}

export class Booking implements IBooking {
    id?: string;
    userId: string;
    providerId: string;
    date: Date;
    pricingId: string;
    updateAt?: Date;
    createdAt?: Date;

    constructor(booking: Booking) {
        this.id = booking.id;
        this.userId = booking.userId;
        this.providerId = booking.providerId;
        this.date = booking.date;
        this.pricingId = booking.pricingId;
        this.updateAt = booking.updateAt;
        this.createdAt = new Date();
    }
}
