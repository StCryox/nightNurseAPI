import { ProviderRepository } from "../../data-layer/repository/provider.repository";
import { DiplomaRepository } from "../../data-layer/repository/diploma.repository";
import { ExperienceRepository } from "../../data-layer/repository/experience.repository";
import { PricingRepository } from "../../data-layer/repository/pricing.repository";
import { Provider } from "../../data-layer/models/provider.model";

export class ProviderService {

    private providerRepository: ProviderRepository;
    private diplomaRepository: DiplomaRepository;
    private experienceRepository: ExperienceRepository;
    private pricingRepository: PricingRepository;

    public async getProviders(): Promise<Provider[]> {
        this.providerRepository = await ProviderRepository.getInstance();
        this.diplomaRepository = await DiplomaRepository.getInstance();
        this.experienceRepository = await ExperienceRepository.getInstance();
        this.pricingRepository = await PricingRepository.getInstance();

        const providerData = this.providerRepository.getAll();
        //Map each lines into object and put in providerData
        this.diplomaRepository.get(providerData[0].diplomaId)
        return [];

    }

    public async getProvider(userId: string): Promise<Provider> {
        this.providerRepository = await ProviderRepository.getInstance();
        this.diplomaRepository = await DiplomaRepository.getInstance();
        this.experienceRepository = await ExperienceRepository.getInstance();
        this.pricingRepository = await PricingRepository.getInstance();

        const providerData = await this.providerRepository.getOne(userId);
        const diploma = await this.diplomaRepository.get( providerData.diplomaId);
        const experience = await this.experienceRepository.get( providerData.experienceId);
        const pricing = await this.pricingRepository.get( providerData.pricingId);
        //Map each lines into object and put in new Provider
        return new Provider(providerData, diploma[0], experience[0], pricing[0]);
    }

    public async create(provider: Provider): Promise<Provider> {
        this.providerRepository = await ProviderRepository.getInstance();
        this.diplomaRepository = await DiplomaRepository.getInstance();
        this.experienceRepository = await ExperienceRepository.getInstance();
        this.pricingRepository = await PricingRepository.getInstance();

        this.diplomaRepository.insert(provider.diploma);
        this.experienceRepository.insert(provider.experience);
        this.pricingRepository.insert(provider.pricing);
        return this.providerRepository.insert(provider);
    }

    public async update(id: string, provider: Provider): Promise<Provider> {
        this.providerRepository = await ProviderRepository.getInstance();
        this.diplomaRepository = await DiplomaRepository.getInstance();
        this.experienceRepository = await ExperienceRepository.getInstance();
        this.pricingRepository = await PricingRepository.getInstance();

        this.diplomaRepository.update(id, provider.diploma);
        this.experienceRepository.update(id, provider.experience);
        this.pricingRepository.update(id, provider.pricing);
        return this.providerRepository.update(id, provider);
    }

    public async delete(id: string): Promise<string> {
        this.providerRepository = await ProviderRepository.getInstance();
        this.diplomaRepository = await DiplomaRepository.getInstance();
        this.experienceRepository = await ExperienceRepository.getInstance();
        this.pricingRepository = await PricingRepository.getInstance();
        
        const provider = await this.getProvider(id);

        this.diplomaRepository.delete(provider.diplomaId);
        this.experienceRepository.delete(provider.experienceId);
        this.pricingRepository.delete(provider.pricingId);
        return this.providerRepository.delete(id);
    }
}
