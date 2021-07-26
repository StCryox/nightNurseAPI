import { ProviderService } from "./business-layer/provider.service";
import { Provider } from "./data-layer/model/provider.model";
import {PricingService} from "./business-layer/pricing.service";
import {Pricing} from "./data-layer/model/pricing.model";


export class ProviderController {

    private providerService: ProviderService;
    private pricingService: PricingService;

    constructor(){
        this.providerService = new ProviderService();
        this.pricingService = new PricingService();
    }

    public async getProviderList(): Promise<Provider[] | null> {
        return this.providerService.getProviders();
    }

    public async getOneProvider(providerId: string): Promise<Provider | null> {
        return this.providerService.getProvider(providerId);
    }

    public async addProvider(provider: Provider): Promise<Provider | null> {
        return this.providerService.createProvider(provider);
    }

    public async editProvider(id: string, provider: Provider): Promise<Provider | null> {
        return this.providerService.updateProvider(id, provider);
    }

    public async removeProvider(id: string): Promise<string | null> {
       return this.providerService.deleteProvider(id);
    }

    public async getOneProviderByUserId(userId: string): Promise<Provider | null> {
        return this.providerService.getProviderByUserId(userId);
    }

    public async getAllOfBookingWithDate(providerId: string, date: string): Promise<Pricing[] | null> {
        return this.pricingService.getAllOfPricingWithDate(providerId, date);
    }
}
