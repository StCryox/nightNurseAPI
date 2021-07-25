import { ProviderService } from "../provider/business-layer/provider.service";
import { Provider } from "../provider/data-layer/model/provider.model";
import { UserService } from "../user/business-layer/user.service";
import { User } from "../user/data-layer/user.model";
import { AuthService } from "./business-layer/auth.service";
import {Session} from "../user/session/data-layer/session.model";

export class AuthController {

    private authService: AuthService;
    private userService: UserService;
    private providerService: ProviderService;


    constructor(){
        this.authService = new AuthService();
        this.userService = new UserService();
        this.providerService = new ProviderService();
    }

    public async ClientSubscribe(user: User): Promise<User | null> {
        return this.userService.createUser(user);
    }

    public async ProviderSubscribe(user: User, provider: Provider): Promise<Provider | null> {
        if(await this.userService.createUser(user) === null){
            return null;
        }
        return this.providerService.createProvider(provider);
    }

    public async login(login: string, password: string): Promise<Session | null> {
        let session = await this.authService.getUser(login, password);
        if(session != undefined) {
            return session;
        }
        return null;
    }

    public async logout(token: string): Promise<string | null> {
       return this.userService.deleteSession(token);
    }
}
