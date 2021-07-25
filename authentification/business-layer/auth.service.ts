import bcrypt from "bcrypt";
import crypto from "crypto";
import { ProviderRepository } from "../../provider/data-layer/repository/provider.repository";
import { UserRepository } from "../../user/data-layer/user.repository";
import { Session } from "../../user/session/data-layer/session.model";
import { SessionRepository } from "../../user/session/data-layer/session.repository";

export class AuthService {

    private userRepository: UserRepository;
    private providerRepository: ProviderRepository;
    private sessionRepository: SessionRepository;
    private saltRounds: number = 15;

    constructor(){
        this.userRepository = new UserRepository();
        this.providerRepository = new ProviderRepository();
        this.sessionRepository = new SessionRepository();
    }

    private async getAllInstance(): Promise<void>{
        this.providerRepository = await ProviderRepository.getInstance();
        this.userRepository = await UserRepository.getInstance();
    }

    public async getUser(login: string, password: string): Promise<Session | null>{
        this.getAllInstance();
        let role = "";
        const user = await this.userRepository.getOne(login);
        if(user === null) {
            try {
                throw new Error('Utilisateur non trouvé.');
            }
            catch(e) {
                console.log(e);
            }
        }
        if(user != undefined) {
            const isSamePassword = bcrypt.compare(bcrypt.hashSync(password,this.saltRounds), user.password);
            if(!isSamePassword) {
                try {
                    throw new Error('Mot de passe incorrect.');
                }
                catch(e) {
                    return null;
                }
            }

            if(user.role == "admin") {
                role ="minad";
            }
            if(user.role == "provider") {
                role ="vider";
            }
        }

        let token = crypto.randomBytes(20).toString('hex');
        token = role + token;
        if(user != undefined){
            return this.sessionRepository.insert({token : token, userId: user.id});
        }
        return null;
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
