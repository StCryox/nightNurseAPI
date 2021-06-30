import {v4 as uuidv4} from 'uuid'

export interface IDiploma {
    id?: string;
    providerId?: string;
    filename: string;
    filePath: string;
    updateAt?: Date;
    createdAt?: Date;
}

export class Diploma implements IDiploma {
    id?: string;
    providerId?: string;
    filename: string;
    filePath: string;
    updateAt?: Date;
    createdAt?: Date;

    constructor(diploma: Diploma) {
        this.id = uuidv4();
        this.providerId = diploma.providerId;
        this.filename = diploma.filename;
        this.filePath = diploma.filePath;
        this.updateAt = diploma.updateAt;
        this.createdAt = new Date();
    }
}