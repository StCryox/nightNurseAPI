import express from "express";
import { ProviderController } from "../controllers/provider.controller";
import { isAuthentified, isAdministrator } from "../middlewares/auth.middleware";

const providerRouter = express.Router();

providerRouter.put("/:id", isAuthentified, isAdministrator, async function(req, res) {
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

export {
    providerRouter
};
