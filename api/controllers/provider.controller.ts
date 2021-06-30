import { ProviderService } from "../../business-layer/services/provider.service";
import { Provider } from "../../data-layer/models/provider.model";

export class ProviderController {

    private providerService: ProviderService;

    constructor(){
        this.providerService = new ProviderService();
    }

    public async getProviderList(): Promise<Provider[]> {
        return this.providerService.getProviders();
    }

    public async getOneProvider(id: string): Promise<Provider> {
        return this.providerService.getProvider(id);
    }

    public async addProvider(provider: Provider): Promise<Provider> {
        return await this.providerService.create(provider);
    }

    public async editProvider(id: string, provider: Provider): Promise<Provider> {
        return await this.providerService.update(id, provider);
    }

    public async removeProvider(id: string): Promise<string> {
       return this.providerService.delete(id);
    }
}
