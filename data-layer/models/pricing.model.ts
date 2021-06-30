import {v4 as uuidv4} from 'uuid'

export interface IPricing {
    id?: string;
    providerId?: string;
    date: Date;
    startHour: number;
    endHour: number;
    price: number;
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
    updateAt?: Date;
    createdAt?: Date;

    constructor(pricing: Pricing) {
        this.id = uuidv4();
        this.providerId = pricing.providerId;
        this.date = pricing.date;
        this.startHour = pricing.startHour;
        this.endHour = pricing.endHour;
        this.price = pricing.price;
        this.updateAt = pricing.updateAt;
        this.createdAt = new Date();
    }
}