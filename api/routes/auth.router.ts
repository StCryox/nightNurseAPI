import express from "express";
import { AuthController } from "../controllers/auth.controller";
import { isAdministrator, isAuthentified } from "../middlewares/auth.middleware";

const authRouter = express.Router();

authRouter.post("/subscribe/client",  async function(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const mail = req.body.mail;
    const login = req.body.login;
    const password = req.body.password;
    const image = req.body.image;
    const birthdate = req.body.birthdate;
    const role = req.body.role;

    if( firstName === undefined 
        || lastName === undefined 
        || mail === undefined 
        || login === undefined 
        || password === undefined 
        || image === undefined 
        || birthdate === undefined 
        || role === undefined) {
        res.status(400).send("Some parameters are missing.").end();
        return;
    }

    const authController = new AuthController();

    const user = await authController.ClientSubscribe({
        firstName,
        lastName,
        mail,
        login,
        password,
        image,
        birthdate,
        role
    });

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
    const role = req.body.role;
    const role = req.body.role;
    const role = req.body.role;


    if( firstName === undefined 
        || lastName === undefined 
        || mail === undefined 
        || login === undefined 
        || password === undefined 
        || image === undefined 
        || birthdate === undefined 
        || role === undefined) {
        res.status(400).send("Some parameters are missing.").end();
        return;
    }

    const authController = new AuthController();
    //TO EDIT
    const user = await authController.ProviderSubscribe({
        firstName,
        lastName,
        mail,
        login,
        password,
        image,
        birthdate,
        role
    },{
        userId,
        description,
        diplomaId,
        experienceId,
        pricingId,
    });

    res.status(201);
    res.json(user);

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
        return;
    } else {
        res.json({
            token: session
        });
    }
});

authRouter.delete("/logout", isAuthentified, async function(req, res) {
    const authController = new AuthController();
    // TO DO with JWT
});

export {
    authRouter
};
