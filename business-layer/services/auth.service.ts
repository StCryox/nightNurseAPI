import { User } from "../../data-layer/models/user.model";
import { Session } from "../../data-layer/models/session.model";
import bcrypt from "bcrypt";
import { UserRepository } from "../../data-layer/repository/user.repository";
import { ProviderRepository } from "../../data-layer/repository/provider.repository";
import { SessionRepository } from "../../data-layer/repository/session.repository";
import { Provider } from "../../data-layer/models/provider.model";

export class AuthService {

    private static userRepository: UserRepository;
    private static providerRepository: ProviderRepository;
    private static sessionRepository: SessionRepository;
    private saltRounds: number = 15;

    public async create(user: User, provider?: Provider): Promise<User | null> {
        AuthService.providerRepository = await ProviderRepository.getInstance();
        AuthService.userRepository = await UserRepository.getInstance();

        const userExist = await AuthService.userRepository.getOne(user.login, user.mail);
        if(userExist){
            try {
                throw new Error('L\'utilisateur existe déjà.');
            }
            catch(e) {
                console.log(e);
            }
        }

        if(provider && user.id !== undefined){
            const providerExist = await AuthService.providerRepository.getOne(user.id);
            if(providerExist){
                try {
                    throw new Error('Le prestataire existe déjà.');
                }
                catch(e) {
                    console.log(e);
                }
            }
            await AuthService.providerRepository.insert(provider);
        }

        // Hash password before inserting in DB
        let hashedPwd: string = bcrypt.hashSync(user.password, this.saltRounds);

        return AuthService.userRepository.insert({
            ...user,
            password: hashedPwd
        });
    }

    public async getUser(login: string, password: string): Promise<Session | null>{
        AuthService.sessionRepository = await SessionRepository.getInstance();
        AuthService.userRepository = await UserRepository.getInstance();

        const user = await AuthService.userRepository.getOne(login);
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
        }

        //Use JWT Authentification to generate TOKEN

        let token = "test";
        let user_id;

        if(user != undefined){
            return AuthService.sessionRepository.insert({token : token, userId: user.id});
        }
        return null;
        
    }

    public async deleteSession(token: string): Promise<string | null> {
        AuthService.sessionRepository = await SessionRepository.getInstance();

        const session = await AuthService.sessionRepository.getOne(token);
        if(session === null) {
            try {
                throw new Error('Vous n\'êtes pas connecté.');
            }
            catch(e) {
                console.log(e);
            }
        }
        return AuthService.sessionRepository.delete(token);
    }

    
    public async getSession(token: string): Promise<Session | null> {
        return AuthService.sessionRepository.getOne(token);
    }

    public async getUserById(id: string): Promise<User | null> {
        AuthService.userRepository = await UserRepository.getInstance();
        return AuthService.userRepository.getOne(undefined,undefined,id);
    }

    public async getProviderId(id: string): Promise<string | null> {
        return AuthService.providerRepository.checkProviderExist(id);
    }

    public async getAllUsers(): Promise<User[] | null>{
        AuthService.userRepository = await UserRepository.getInstance();
        return AuthService.userRepository.getAll();
    }

    public async updateUser(fieldName: string, fieldValue: string, id: string): Promise<string | null> {
        AuthService.userRepository = await UserRepository.getInstance();
        return AuthService.userRepository.updateOneField(fieldName,fieldValue,id);
    }

    public async getSessionByToken(id: string): Promise<Session | null> {
        AuthService.sessionRepository = await SessionRepository.getInstance();
        return AuthService.sessionRepository.getOne(id);
    }
}
