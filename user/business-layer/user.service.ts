
import { User } from "../data-layer/user.model";
import { UserRepository } from "../data-layer/user.repository";
import { Session } from "../session/data-layer/session.model";
import { SessionRepository } from "../session/data-layer/session.repository";

export class UserService {

    private userRepository: UserRepository;
    private sessionRepository: SessionRepository;

    constructor(){
        this.userRepository = new UserRepository();
        this.sessionRepository = new SessionRepository();
    }

    public async getUser(id: string): Promise<User | null> {
        return this.userRepository.getOne(id);
    }

    public async getUsers(): Promise<User[] | null> {
        return this.userRepository.getAll();
    }

    public async updateUser(id: string, user: User): Promise<User | null> {
        return this.userRepository.update(id, user);
    }

    public async removeUser(id: string): Promise<string | null>{
        return this.userRepository.delete(id);
    }

    public async getSession(token: string): Promise<Session | null> {
        return this.sessionRepository.getOne(token);
    } 
}
