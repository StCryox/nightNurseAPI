export interface IPricing {
    id?: string;
    providerId?: string;
    date: Date;
    startHour: number;
    endHour: number;
    price: number;
    hourlyPrice: number;
    updateAt?: Date;
    createdAt?: Date;
}

export class Pricing implements IPricing {
    id?: string;
    providerId?: string;
    date: Date;
    startHour: number;
    endHour: number;
    price: number;
    hourlyPrice: number;
    updateAt?: Date;
    createdAt?: Date;

    constructor(pricing: Pricing) {
        this.id = pricing.id;
        this.providerId = pricing.providerId;
        this.date = pricing.date;
        this.startHour = pricing.startHour;
        this.endHour = pricing.endHour;
        this.price = pricing.price;
        this.hourlyPrice = pricing.price;
        this.updateAt = pricing.updateAt;
        this.createdAt = new Date();
    }
}