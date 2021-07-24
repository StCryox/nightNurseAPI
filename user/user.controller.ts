import { User } from "../user/data-layer/user.model";
import { Session } from "../user/session/data-layer/session.model";
import { UserService } from "./business-layer/user.service";


export class UserController {

    private userService: UserService;

    constructor(){
        this.userService = new UserService();
    }
   
    public async getUserById(id: string): Promise<User | null> {
        return this.userService.getUser(id);
    }

    public async getAllUsers(): Promise<User[] | null> {
        return this.userService.getUsers();
    }

    public async updateUser(id: string, user: User): Promise<User | null> {
        return this.userService.updateUser(id, user);
    }

    public async removeUser(id: string): Promise<string | null>{
        return this.userService.removeUser(id);
    }

    public async getSession(token: string): Promise<Session | null> {
        return this.userService.getSession(token);
    } 
}
