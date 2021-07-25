
import { User } from "../data-layer/user.model";
import { UserRepository } from "../data-layer/user.repository";
import { Session } from "../session/data-layer/session.model";
import { SessionRepository } from "../session/data-layer/session.repository";
import bcrypt from "bcrypt";

export class UserService {

    private userRepository: UserRepository;
    private sessionRepository: SessionRepository;
    private saltRounds: number = 15;

    constructor(){
        this.userRepository = new UserRepository();
        this.sessionRepository = new SessionRepository();
    }

    public async getUser(id: string): Promise<User | null> {
        this.userRepository = await UserRepository.getInstance();
        return this.userRepository.getOne(undefined,undefined,id);
    }

    public async getUsers(): Promise<User[] | null> {
        this.userRepository = await UserRepository.getInstance();
        return this.userRepository.getAll();
    }

    public async createUser(user: User): Promise<User | null> {
        this.userRepository = await UserRepository.getInstance();

        const userExist = await this.userRepository.getOne(user.login, user.mail);
        if(userExist){
            try {
                throw new Error('L\'utilisateur existe déjà.');
            }
            catch(e) {
                console.log(e);
                return null;
            }
        }

        let hashedPwd: string = bcrypt.hashSync(user.password, this.saltRounds);

        return this.userRepository.insert({
            ...user,
            password: hashedPwd
        });
    }

    public async updateUser(id: string, user: User): Promise<User | null> {
        this.userRepository = await UserRepository.getInstance();
        return this.userRepository.update(id, user);
    }

    public async removeUser(id: string): Promise<string | null>{
        this.userRepository = await UserRepository.getInstance();
        return this.userRepository.delete(id);
    }

    public async getSession(token: string): Promise<Session | null> {
        this.sessionRepository = await SessionRepository.getInstance();
        return this.sessionRepository.getOne(token);
    } 

    public async deleteSession(token: string): Promise<string | null> {
        this.sessionRepository = await SessionRepository.getInstance();

        const session = await this.sessionRepository.getOne(token);
        if(session === null) {
            try {
                throw new Error('Vous n\'êtes pas connecté.');
            }
            catch(e) {
                console.log(e);
            }
        }
        return this.sessionRepository.delete(token);
    }
}