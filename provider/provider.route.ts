import express from "express";
import {v4 as uuidv4} from 'uuid';
import { isAuthentified, isProvider } from "../authentification/auth.middleware";
import { Diploma } from "./data-layer/model/diploma.model";
import { Experience } from "./data-layer/model/experience.model";
import { Pricing } from "./data-layer/model/pricing.model";
import { Provider } from "./data-layer/model/provider.model";
import { ProviderController } from "./provider.controller";

const providerRouter = express.Router();

providerRouter.get("/", async function(req, res) {
    const providerController = new ProviderController();
    const providerList = await providerController.getProviderList();
    res.status(200).json(providerList).end();
});

providerRouter.get("/providerId/:id", async function(req, res) {
    const providerId = req.params.id;
    if( providerId === undefined) {
        res.status(400).send("Id is missing.").end();
        return;
    }
    const providerController = new ProviderController();
    const provider = await providerController.getOneProvider(providerId);
    res.status(200).json(provider).end();
});

providerRouter.get("/userId/:id", async function(req, res) {
    const userId = req.params.id;
    if( userId === undefined) {
        res.status(400).send("Id is missing.").end();
        return;
    }
    const providerController = new ProviderController();
    const provider = await providerController.getOneProviderByUserId(userId);
    res.status(200).json(provider).end();
});

providerRouter.put("/:id", isAuthentified, isProvider, async function(req, res) {
    const id = req.params.id;
    const userId = req.body.userId;
    const description = req.body.description;
    const verified = req.body.verified;
    const diploma = req.body.diploma;
    const experience = req.body.experience;
    const pricing = req.body.pricing;
    
    if( id === undefined
        || userId === undefined 
        || description === undefined 
        || verified === undefined 
        || diploma === undefined 
        || experience === undefined 
        || pricing === undefined) {
        res.status(400).send("Some parameters are missing.").end();
        return;
    }

    const providerController = new ProviderController();

    let diplomaLen = Object.keys(diploma).length;
    let experienceLen = Object.keys(experience).length;
    let pricingLen = Object.keys(pricing).length;
    let ProviderDiploma: Diploma[] = [];
    let ProviderExperience: Experience[] = [];
    let ProviderPricing: Pricing[] = [];

    for(let i=0; i<diplomaLen; i++){
        ProviderDiploma.push(
            new Diploma({
                id: diploma[i].id || uuidv4(),
                providerId: id,
                filename: diploma[i].filename,
                filePath: diploma[i].filePath,
                updateAt: new Date()
            })
        );
    }

    for(let i=0; i<experienceLen; i++){
        ProviderExperience.push(
            new Experience({
                id:  experience[i].id || uuidv4(),
                providerId: id,
                startYear: experience[i].startYear,
                endYear: experience[i].endYear,
                title: experience[i].title,
                description: experience[i].experience,
                updateAt: new Date()
            })
        );
        
    }

    for(let i=0; i<pricingLen; i++){
        ProviderPricing.push(
            new Pricing({
                id: pricing[i].id || uuidv4(),
                providerId: id,
                date: pricing[i].date,
                startHour: pricing[i].startHour,
                endHour: pricing[i].endHour,
                price: pricing[i].price,
                hourlyPrice: pricing[i].hourlyPrice,
                updateAt: new Date()
            })
        );
    }

    const provider = new Provider({
        id: id,
        userId: userId,
        description,
        verified
    },
        ProviderDiploma,
        ProviderExperience,
        ProviderPricing
    );

    const result = await providerController.editProvider(id, provider);

    res.status(201);
    res.json(result);

});

providerRouter.delete("/:id", isAuthentified, async function(req, res) {
    const providerController = new ProviderController();
    const result = await providerController.removeProvider(req.params.id);
    res.status(200).json(result).end();
});

/*providerRouter.get("/pricing/date", async function(req, res) {
    const providerId = req.body.providerId;
    const date = req.body.date;
    if( providerId === undefined || date === undefined) {
        res.status(400).send("Paramaters are missing.").end();
        return;
    }
    const providerController = new ProviderController();
    const pricings = await providerController.getAllOfPricingWithDate(providerId, date);
    res.status(200).json(pricings).end();
});*/

/*providerRouter.get("/pricing", async function(req, res) {
    const providerId = req.body.providerId;
    if( providerId === undefined || date) {
        res.status(400).send("Paramaters are missing.").end();
        return;
    }
    const providerController = new ProviderController();
    const pricings = await providerController.getAllOfPricingProvider(providerId);
    res.status(200).json(pricings).end();
});*/

export {
    providerRouter
};
