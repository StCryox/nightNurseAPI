import { User } from "../../data-layer/models/user.model";
import { Session } from "../../data-layer/models/session.model";
import bcrypt from "bcrypt";
import { UserRepository } from "../../data-layer/repository/user.repository";
import { ProviderRepository } from "../../data-layer/repository/provider.repository";
import { SessionRepository } from "../../data-layer/repository/session.repository";
import { Provider } from "../../data-layer/models/provider.model";

export class AuthService {

    private userRepository: UserRepository;
    private providerRepository: ProviderRepository;
    private sessionRepository: SessionRepository;
    private saltRounds: number = 15;

    public async create(user: User, provider?: Provider): Promise<User> {
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

        if(provider){
            const providerExist = await this.providerRepository.getOne(user.id);
            if(providerExist){
                try {
                    throw new Error('Le prestataire existe déjà.');
                }
                catch(e) {
                    console.log(e);
                }
            }
        }
        
        await this.providerRepository.insert(provider);

        // Hash password before inserting in DB
        let hashedPwd: string = bcrypt.hashSync(user.password, this.saltRounds);

        return await this.userRepository.insert({
            ...user,
            password: hashedPwd
        });
    }

    public async getUser(login: string, password: string): Promise<Session> {
        this.sessionRepository = await SessionRepository.getInstance();
        this.userRepository = await UserRepository.getInstance();

        const user = await this.userRepository.getOne(login);
        if(user === null) {
            try {
                throw new Error('Utilisateur non trouvé.');
            }
            catch(e) {
                console.log(e);
            }
        }
        const isSamePassword = bcrypt.compareSync(password, user.password);
        if(!isSamePassword) {
            try {
                throw new Error('Mot de passe incorrect.');
            }
            catch(e) {
                console.log(e);
            }
        }

        //Use JWT Authentification to generate TOKEN

        let token = "";
        
        return this.sessionRepository.insert({token, userId: user.id});
    }

    public async deleteSession(token: string): Promise<string> {
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
