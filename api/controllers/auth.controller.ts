import { AuthService } from "../../business-layer/services/auth.service";
import { Provider } from "../../data-layer/models/provider.model";
import { Session } from "../../data-layer/models/session.model";
import { User } from "../../data-layer/models/user.model";

export class AuthController {

    private authService: AuthService;


    constructor(){
        this.authService = new AuthService();
    }

    public async ClientSubscribe(user: User): Promise<User | null> {
        return this.authService.create(user);
    }

    public async ProviderSubscribe(user: User, provider: Provider): Promise<User | null> {
        return this.authService.create(user, provider);
    }


    public async login(login: string, password: string): Promise<string | null> {
        let session = await this.authService.getUser(login, password);
        if(session != undefined) {
            return session.token;
        }
        return null;
    }

    public async logout(token: string): Promise<string | null> {
       return this.authService.deleteSession(token);
    }

    public async getSession(token: string): Promise<Session | null> {
        return this.authService.getSession(token);
    } 

    public async getProviderId(id: string): Promise<string | null> {
        return this.authService.getProviderId(id);
    }

    public async getUserById(id: string): Promise<User | null> {
        return this.authService.getUserById(id);
    }

    public async getAllUsers(): Promise<User[] | null> {
        return this.authService.getAllUsers();
    }

    public async updateUser(fieldName: string, fieldValue: string, id: string): Promise<string | null> {
        return this.authService.updateUser(fieldName,fieldValue,id);
    }

    public async getSessionByToken(token: string): Promise<Session | null> {
        return this.authService.getSessionByToken(token);
    }

}
