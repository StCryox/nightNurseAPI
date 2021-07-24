import express from "express";
import { isAuthentified, isProvider } from "../authentification/auth.middleware";
import { ProviderController } from "./provider.controller";

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

providerRouter.put("/:id", isAuthentified, isProvider, async function(req, res) {
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

/*providerRouter.get("/like", isAuthentified, async function(req, res) {
    const providerController = new ProviderController();
    const providerList = await providerController.getProviderList();
    res.status(200).json(providerList).end();
});

providerRouter.get("/like/:id", isAuthentified, async function(req, res) {
    const id = req.params.id;
    if( id === undefined) {
        res.status(400).send("Id is missing.").end();
        return;
    }
    const providerController = new ProviderController();
    const provider = await providerController.getOneProvider(id);
    res.status(200).json(provider).end();
});

providerRouter.post("/like", isAuthentified, isProvider, async function(req, res) {
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

providerRouter.put("/like/:id", isAuthentified, isProvider, async function(req, res) {
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

providerRouter.delete("/like/:id", isAuthentified, async function(req, res) {
    const providerController = new ProviderController();
    const result = await providerController.removeProvider(req.params.id);
    res.status(200).json(result).end();
});*/

export {
    providerRouter
};
