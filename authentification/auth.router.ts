import express from "express";
import {v4 as uuidv4} from 'uuid';
import { Diploma } from "../provider/data-layer/model/diploma.model";
import { Experience } from "../provider/data-layer/model/experience.model";
import { Pricing } from "../provider/data-layer/model/pricing.model";
import { Provider } from "../provider/data-layer/model/provider.model";
import { User } from "../user/data-layer/user.model";
import { AuthController } from "./auth.controller";
import { isAuthentified } from "./auth.middleware";

const authRouter = express.Router();

authRouter.post("/subscribe/client",  async function(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const mail = req.body.mail;
    const login = req.body.login;
    const password = req.body.password;
    const image = req.body.image;
    const birthdate = req.body.birthdate;
    const role = "client";
    const address = req.body.birthdate;
    const zipcode = req.body.birthdate;
    const province = req.body.birthdate;
    const phoneNumber = req.body.birthdate;

    if( firstName === undefined 
        || lastName === undefined 
        || mail === undefined 
        || login === undefined 
        || password === undefined 
        || image === undefined 
        || birthdate === undefined
        || address === undefined
        || zipcode === undefined
        || province === undefined
        || phoneNumber === undefined) {
        res.status(400).send("Some parameters are missing.").end();
        return;
    }

    const authController = new AuthController();

    const user = new User({
        id: uuidv4(),
        firstName,
        lastName,
        mail,
        login,
        password,
        image,
        birthdate,
        role,
        address,
        zipcode,
        province,
        phoneNumber
    });

    await authController.ClientSubscribe(user);

    res.status(201);
    res.json(user);
});

authRouter.post("/subscribe/provider",  async function(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const mail = req.body.mail;
    const login = req.body.login;
    const password = req.body.password;
    const image = req.body.image;
    const birthdate = req.body.birthdate;
    const role = "provider";
    const address = req.body.birthdate;
    const zipcode = req.body.birthdate;
    const province = req.body.birthdate;
    const phoneNumber = req.body.birthdate;
    const verified = null;
    const description = req.body.description;
    const diploma = req.body.diploma;
    const experience = req.body.experience;
    const pricing = req.body.pricing;

    if( firstName === undefined 
        || lastName === undefined 
        || mail === undefined 
        || login === undefined 
        || password === undefined 
        || image === undefined 
        || birthdate === undefined 
        || address === undefined
        || zipcode === undefined
        || province === undefined
        || phoneNumber === undefined
        || description === undefined 
        || diploma === undefined 
        || experience === undefined 
        || pricing === undefined) {
        res.status(400).send("Some parameters are missing.").end();
        return;
    }

    const authController = new AuthController();
    
    const user = new User({
        id: uuidv4(),
        firstName,
        lastName,
        mail,
        login,
        password,
        image,
        birthdate,
        role,
        address,
        zipcode,
        province,
        phoneNumber
    });

    let providerId = uuidv4();

    const ProviderDiploma = new Diploma({
        id: uuidv4(),
        providerId: providerId,
        filename: diploma.filename,
        filePath: diploma.filePath
    });

    const ProviderExperience = new Experience({
        id: uuidv4(),
        providerId: providerId,
        startYear: experience.startYear,
        endYear: experience.endYear,
        title: experience.title,
        description: experience.experience
    });

    const ProviderPricing = new Pricing({
        id: uuidv4(),
        providerId: providerId,
        date: pricing.date,
        startHour: pricing.startHour,
        endHour: pricing.endHour,
        price: pricing.price,
        hourlyPrice: pricing.hourlyPrice
    });

    const provider = new Provider({
        id: providerId,
        userId: user.id,
        description,
        verified,
        diploma: ProviderDiploma,
        experience: ProviderExperience,
        pricing: ProviderPricing
    });

    const result = await authController.ProviderSubscribe(user, provider);

    res.status(201);
    res.json(result);
});

authRouter.post("/login", async function(req, res) {
    const login = req.body.login;
    const password = req.body.password;
    if(login === undefined || password === undefined) {
        res.status(400).send("Some parameters are missing.").end();
        return;
    }
    const authController = new AuthController();
    const session = await authController.login(login, password);
    if(session === null) {
        res.status(404).send("Account doesn't exist.").end();
    } else {
        res.json({
            token: session
        });
    }
});

authRouter.delete("/logout", isAuthentified, async function(req, res) {
    const authController = new AuthController();
    const auth = req.headers["authorization"];
    if(auth !== undefined) {
        const token = auth.slice(7);
        const result = await authController.logout(token);
        if(result === null){
            res.status(404).send("You're not logged in.").end();
        }
        res.status(200).json(result).end();
    }
    res.status(403).send("Access denied.").end();
});

export {
    authRouter
};
