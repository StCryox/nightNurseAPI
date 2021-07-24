import bcrypt from "bcrypt";
import crypto from "crypto";
import { Provider } from "../../provider/data-layer/model/provider.model";
import { ProviderRepository } from "../../provider/data-layer/repository/provider.repository";
import { User } from "../../user/data-layer/user.model";
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

    public async create(user: User, provider?: Provider): Promise<User | null> {
        this.providerRepository = await ProviderRepository.getInstance();
        this.userRepository = await UserRepository.getInstance();

        const userExist = await this.userRepository.getOne(user.login, user.mail);
        if(userExist){
            try {
                throw new Error('L\'utilisateur existe déjà.');
            }
            catch(e) {
                console.log(e);
            }
        }

        if(provider && user.id !== undefined){
            const providerExist = await this.providerRepository.getOne(user.id);
            if(providerExist){
                try {
                    throw new Error('Le prestataire existe déjà.');
                }
                catch(e) {
                    console.log(e);
                }
            }
            await this.providerRepository.insert(provider);
        }

        // Hash password before inserting in DB
        let hashedPwd: string = bcrypt.hashSync(user.password, this.saltRounds);

        return this.userRepository.insert({
            ...user,
            password: hashedPwd
        });
    }

    public async getUser(login: string, password: string): Promise<Session | null>{
        this.sessionRepository = await SessionRepository.getInstance();
        this.userRepository = await UserRepository.getInstance();

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
