import { AuthService } from "../../business-layer/services/auth.service";
import { Provider } from "../../data-layer/models/provider.model";
import { User } from "../../data-layer/models/user.model";

export class AuthController {

    private authService: AuthService;

    constructor(){
        this.authService = new AuthService();
    }

    public async ClientSubscribe(user: User): Promise<User> {
        return this.authService.create(user);
    }

    public async ProviderSubscribe(user: User, provider: Provider): Promise<User> {
        return this.authService.create(user, provider);
    }


    public async login(login: string, password: string): Promise<string> {
        let session = await this.authService.getUser(login, password);
        return session.token;
    }

    public async logout(token: string): Promise<string> {
       return this.authService.deleteSession(token);
    }
}
