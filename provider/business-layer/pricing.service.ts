import {PricingRepository} from "../data-layer/repository/pricing.repository";
import {Pricing} from "../data-layer/model/pricing.model";

export class PricingService {

    private pricingRepository!: PricingRepository;


    constructor(){
        this.pricingRepository = new PricingRepository();
    }

    public async getAllOfPricing(id: string): Promise<Pricing[] | null> {
        this.pricingRepository = await PricingRepository.getInstance();
        return this.pricingRepository.getAllOfPricing(id);
    }


    public async getOnePricing(id: string): Promise<Pricing | null> {
        this.pricingRepository = await PricingRepository.getInstance();
        return this.pricingRepository.getOne(id);
    }

    public async update(id: string, pricing: Pricing): Promise<Pricing | null> {
        this.pricingRepository = await PricingRepository.getInstance();
        return this.pricingRepository.update(id, pricing);
    }

    public async remove(id: string): Promise<string | null> {
        this.pricingRepository = await PricingRepository.getInstance();
        return this.pricingRepository.delete(id);
    }
    public async getAllOfPricingWithDate(providerId: string, date: string):Promise<Pricing[] | null> {
        this.pricingRepository = await PricingRepository.getInstance();
        return this.pricingRepository.getAllOfPricingWithDate(providerId,date);
    }

}
