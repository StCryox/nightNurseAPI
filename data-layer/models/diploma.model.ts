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
        this.id = diploma.id;
        this.providerId = diploma.providerId;
        this.filename = diploma.filename;
        this.filePath = diploma.filePath;
        this.updateAt = diploma.updateAt;
        this.createdAt = new Date();
    }
}