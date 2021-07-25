import { ProviderService } from "../provider/business-layer/provider.service";


export class AdminController {

    private providerService: ProviderService;

    constructor(){
        this.providerService = new ProviderService();
    }

    public async verifyDiploma(userId: string, verified: boolean | null): Promise<boolean | null> {
        return this.providerService.setDiplomaVerifiction(userId, verified);
    }
}
