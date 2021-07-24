import { Diploma } from './diploma.model';
import { Experience } from './experience.model';
import { Pricing } from './pricing.model';

export interface IProvider {
    id?: string;
    userId?: string;
    description?: string;
    verified?: boolean | null;
    diplomaId?: string;
    experienceId?: string;
    pricingId?: string;
    updateAt?: Date;
    createdAt?: Date;
}

export class Provider implements IProvider {
    id?: string;
    userId?: string;
    description?: string;
    verified?: boolean | null;

    diplomaId?: string;
    experienceId?: string;
    pricingId?: string;
    updateAt?: Date;    
    createdAt?: Date;

    diploma?: { 
        filename: string; 
        filePath: string; 
    };
    experience?: { 
        startYear: number; 
        endYear: number; 
        title: string; 
        description: string; 
    };
    pricing?: { 
        date: Date; 
        startHour: number; 
        endHour: number; 
        price: number; 
    };

    constructor(provider: Provider, diploma?: Diploma, experience?: Experience, pricing?: Pricing) {
        if(diploma && experience && pricing){
            this.id = provider.id;
            this.userId = provider.userId;
            this.description = provider.description;
            this.verified = provider.verified;
            this.diploma = diploma;
            this.experience = experience;
            this.pricing = pricing;
            this.updateAt = provider.updateAt;
            this.createdAt = new Date();
        }
        this.id = provider.id;
        this.userId = provider.userId;
        this.description = provider.description;
        this.verified = provider.verified;
        this.diplomaId = provider.diplomaId;
        this.experienceId = provider.experienceId;
        this.pricingId = provider.pricingId;
        this.updateAt = provider.updateAt;
        this.createdAt = new Date();
    }
}


