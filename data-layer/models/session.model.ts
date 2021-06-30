import {v4 as uuidv4} from 'uuid'

export interface ISession {
    id?: string;
    token: string;
    updateAt?: Date;
    createdAt?: Date;
    userId: string;
}

export class Session implements ISession {
    id?: string;
    token: string;
    updateAt?: Date;
    createdAt?: Date;
    userId: string;

    constructor(session: Session) {
        this.id = uuidv4();
        this.token = session.token;
        this.createdAt = new Date();
        this.updateAt = session.updateAt;
        this.userId = session.userId;
    }
    
}