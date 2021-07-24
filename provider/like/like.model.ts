export interface ILike{
    id?: string;
    userId: string;
    providerId: string;
    like: boolean | null;
    updateAt?: Date;
    createdAt?: Date;
}

export class Like implements ILike {
    id?: string;
    userId: string;
    providerId: string;
    like: boolean | null;
    updateAt?: Date;
    createdAt?: Date;

    constructor(like: Like) {
        this.id = like.id;
        this.userId = like.userId;
        this.providerId = like.providerId;
        this.like = like.like;
        this.updateAt = like.updateAt;
        this.createdAt = new Date();
    }
}

