import {v4 as uuidv4} from 'uuid'

export interface IExperience {
    id?: string;
    providerId?: string;
    startYear: number;
    endYear: number;
    title: string;
    description: string;
    updateAt?: Date;
    createdAt?: Date;
}

export class Experience implements IExperience {
    id?: string;
    providerId?: string;
    startYear: number;
    endYear: number;
    title: string;
    description: string;
    updateAt?: Date;
    createdAt?: Date;

    constructor(experience: Experience) {
        this.id = uuidv4();
        this.providerId = experience.providerId;
        this.startYear = experience.startYear;
        this.endYear = experience.endYear;
        this.title = experience.title;
        this.description = experience.description;
        this.updateAt = experience.updateAt;
        this.createdAt = new Date();
    }
}