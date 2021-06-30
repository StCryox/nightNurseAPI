import express from "express";
import { ProviderController } from "../controllers/provider.controller";
import { isAuthentified } from "../middlewares/auth.middleware";

const providerRouter = express.Router();

providerRouter.get("/", isAuthentified, async function(req, res) {
    const providerController = new ProviderController();
    const providerList = await providerController.getProviderList();
    res.status(200).json(providerList).end();
});

providerRouter.get("/:id", isAuthentified, async function(req, res) {
    const id = req.params.id;
    if( id === undefined) {
        res.status(400).send("Id is missing.").end();
        return;
    }
    const providerController = new ProviderController();
    const provider = await providerController.getOneProvider(id);
    res.status(200).json(provider).end();
});

providerRouter.post("/", isAuthentified, async function(req, res) {
    const userId = req.body.userId;
    const description = req.body.description;
    const diploma = req.body.diploma;
    const experience = req.body.experience;
    const pricing = req.body.pricing;
    
    if( userId === undefined 
        || description === undefined 
        || diploma === undefined 
        || experience === undefined 
        || pricing === undefined) {
        res.status(400).send("Some parameters are missing.").end();
        return;
    }

    const providerController = new ProviderController();

    const provider = await providerController.addProvider({
        userId,
        description,
        diploma,
        experience,
        pricing
    });

    res.status(201);
    res.json(provider);
  
});

providerRouter.put("/:id", isAuthentified, async function(req, res) {
    const id = req.params.id;
    const userId = req.body.userId;
    const description = req.body.description;
    const diploma = req.body.diploma;
    const experience = req.body.experience;
    const pricing = req.body.pricing;
    
    if( id === undefined
        || userId === undefined 
        || description === undefined 
        || diploma === undefined 
        || experience === undefined 
        || pricing === undefined) {
        res.status(400).send("Some parameters are missing.").end();
        return;
    }

    const providerController = new ProviderController();

    const provider = await providerController.editProvider(id, {
        userId,
        description,
        diploma,
        experience,
        pricing
    });

    res.status(201);
    res.json(provider);

});

providerRouter.delete("/:id", isAuthentified, async function(req, res) {
    const providerController = new ProviderController();
    const result = await providerController.removeProvider(req.params.id);
    res.status(200).json(result).end();
});

export {
    providerRouter
};
