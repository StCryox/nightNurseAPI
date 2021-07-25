import { Diploma } from "../data-layer/model/diploma.model";
import { Provider } from "../data-layer/model/provider.model";
import { DiplomaRepository } from "../data-layer/repository/diploma.repository";
import { ExperienceRepository } from "../data-layer/repository/experience.repository";
import { PricingRepository } from "../data-layer/repository/pricing.repository";
import { ProviderRepository } from "../data-layer/repository/provider.repository";
import {v4 as uuidv4} from 'uuid';
import { Experience } from "../data-layer/model/experience.model";
import { Pricing } from "../data-layer/model/pricing.model";
import e from "express";

export class ProviderService {

    private providerRepository: ProviderRepository;
    private diplomaRepository: DiplomaRepository;
    private experienceRepository: ExperienceRepository;
    private pricingRepository: PricingRepository;

    constructor(){
        this.providerRepository = new ProviderRepository();
        this.diplomaRepository = new DiplomaRepository();
        this.experienceRepository = new ExperienceRepository();
        this.pricingRepository = new PricingRepository();
    }

    private async getAllInstance(): Promise<void>{
        this.providerRepository = await ProviderRepository.getInstance();
        this.diplomaRepository = await DiplomaRepository.getInstance();
        this.experienceRepository = await ExperienceRepository.getInstance();
        this.pricingRepository = await PricingRepository.getInstance();
    }

    public async getProviders(): Promise<Provider[] | null> {
        await this.getAllInstance();
        let providerList: Provider[] = [];
        let diploma: Diploma[] | null = [];
        let experience: Experience[] | null = [];
        let pricing: Pricing[] | null = [];

        const provider: Provider[] | null = await this.providerRepository.getAll();

        if(provider){
            let providerLen = Object.keys(provider).length;

            for(let i=0; i<providerLen; i++){
                diploma = await this.diplomaRepository.get(provider[i].id);

                experience = await this.experienceRepository.get(provider[i].id);

                pricing = await this.pricingRepository.get(provider[i].id);
                if(diploma &&experience && pricing){
                    providerList.push(new Provider(provider[i], diploma, experience, pricing));
                }
            }
        }
        return providerList;
    }

    public async getProvider(providerId: string): Promise<Provider | null> {
        await this.getAllInstance();
        console.log("userId : " + providerId);
        const provider = await this.providerRepository.getOne(providerId);
        const diploma: Diploma[] | null =  await this.diplomaRepository.get(providerId);
        const experience: Experience[] | null = await this.experienceRepository.get(providerId);
        const pricing: Pricing[] | null =  await this.pricingRepository.get(providerId);

        if(provider && diploma &&experience && pricing){

            return new Provider(provider, diploma, experience, pricing);
        }
        console.log("null");
        return null;
    }

    public async setDiplomaVerifiction(userId: string, verified: boolean | null): Promise<boolean | null> {
        return this.providerRepository.verifyProvider(userId, verified);
    }

    public async createProvider(provider: Provider): Promise<Provider | null> {
        await this.getAllInstance();

        if(await this.providerRepository.checkProviderExist(provider.id) !== null){
            return null;
        }

        await this.providerRepository.insert({
                id: provider.id,
                userId: provider.userId,
                description: provider.description,
                verified: provider.verified,
        });

        let diplomaLen, experienceLen ,pricingLen = 0;
        if(provider.diploma){
            diplomaLen =  Object.keys(provider.diploma).length;
            for(let i=0; i<diplomaLen; i++){
                await this.diplomaRepository.insert(provider.diploma[i]);
            }
        }

        if(provider.experience){
            experienceLen =  Object.keys(provider.experience).length;
            for(let i=0; i<experienceLen; i++){
                await this.experienceRepository.insert(provider.experience[i]);
            }
        }
        if(provider.pricing){
            pricingLen =  Object.keys(provider.pricing).length;
            for(let i=0; i<pricingLen; i++){
                await this.pricingRepository.insert(provider.pricing[i]);
            }
        }

        if(provider.id){
            return this.getProvider(provider.id);
        }
        return null;
    }

    public async updateProvider(id: string, provider: Provider): Promise<Provider | null> {
        await this.getAllInstance();
        await this.providerRepository.update(id, {
            id: provider.id,
            userId: provider.userId,
            description: provider.description,
            verified: provider.verified,
        });

        let diplomaLen, experienceLen ,pricingLen = 0;

        if(provider.diploma){
            diplomaLen =  Object.keys(provider.diploma).length;
            for(let i=0; i<diplomaLen; i++){
                await this.diplomaRepository.update(provider.diploma[i].id, provider.diploma[i]);
            }
        }

        if(provider.experience){
            experienceLen =  Object.keys(provider.experience).length;
            for(let i=0; i<experienceLen; i++){
                await this.experienceRepository.update(provider.experience[i].id, provider.experience[i]);
            }
        }
        if(provider.pricing){
            pricingLen =  Object.keys(provider.pricing).length;
            for(let i=0; i<pricingLen; i++){
                await this.pricingRepository.update(provider.pricing[i].id, provider.pricing[i]);
            }
        }

        if(provider.id){
            return this.getProvider(provider.id);
        }
        return null;
    }

    public async deleteProvider(id: string): Promise<string | null> {
        await this.getAllInstance();
        await this.diplomaRepository.delete(id);
        await this.experienceRepository.delete(id);
        await this.pricingRepository.delete(id);
        return this.providerRepository.delete(id);
    }
}
