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
        await this.getAllInstance();

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
            console.log("user : " + user.firstName + user.id + " hashed : " + bcrypt.hashSync(password,this.saltRounds));
            const isSamePassword = bcrypt.compareSync(password, user.password);
            if(!isSamePassword) {
                try {
                    throw new Error('Mot de passe incorrect.');
                }
                catch(e) {
                    console.log(e);
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
}
