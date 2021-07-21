export interface ISession {
    id?: string;
    token: string;
    updateAt?: Date;
    createdAt?: Date;
    userId?: string;
}

export class Session implements ISession {
    id?: string;
    token: string;
    updateAt?: Date;
    createdAt?: Date;
    userId?: string;

    constructor(session: Session) {
        this.id = session.id;
        this.token = session.token;
        this.createdAt = new Date();
        this.updateAt = session.updateAt;
        this.userId = session.userId;
    }
    
}