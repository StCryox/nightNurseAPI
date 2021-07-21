export interface IComment {
    id?: string;
    userId: string;
    providerId: string;
    title: string;
    comment: string;
    updateAt?: Date;
    createdAt?: Date;
}

export class Comment implements IComment {
    id?: string;
    userId: string;
    providerId: string;
    title: string;
    comment: string;
    updateAt?: Date;
    createdAt?: Date;

    constructor(comment: Comment) {
        this.id = comment.id;
        this.userId = comment.userId;
        this.providerId = comment.providerId;
        this.title = comment.title;
        this.comment = comment.comment;
        this.updateAt = comment.updateAt;
        this.createdAt = new Date();
    }
}