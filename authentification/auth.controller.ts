import { Provider } from "../provider/data-layer/model/provider.model";
import { User } from "../user/data-layer/user.model";
import { AuthService } from "./business-layer/auth.service";

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
}
