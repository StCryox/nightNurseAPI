import express from "express";
import {v4 as uuidv4} from 'uuid'
import { Provider } from "../../data-layer/models/provider.model";
import { User } from "../../data-layer/models/user.model";
import { AuthController } from "../controllers/auth.controller";
import {isAuthentified} from "../middlewares/auth.middleware";
import {bookingRouter} from "./booking.route";

const authRouter = express.Router();
const stripe = require("stripe")("sk_test_51JFzBbFJFVSlloUZiKyxrzKKlUz6oPGW2kphACoTGYBy9yvuDefscMBCgjXixu6UFntDU0dO5wcRmgftkPliTkeV00ULwbWv3p");
authRouter.post("/subscribe/client",  async function(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const mail = req.body.mail;
    const login = req.body.login;
    const password = req.body.password;
    const image = req.body.image;
    const birthdate = req.body.birthdate;
    const role = "client";

    if( firstName === undefined 
        || lastName === undefined 
        || mail === undefined 
        || login === undefined 
        || password === undefined 
        || image === undefined 
        || birthdate === undefined) {
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
        role
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
        role
    });

    const provider = new Provider({
        userId: user.id,
        description,
        verified,
        diploma,
        experience,
        pricing
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

authRouter.post("/user/update", async function(req, res) {
    const fieldName = req.body.fieldName;
    const fieldValue = req.body.value;
    const id = req.body.id;
    if(fieldValue === undefined || fieldName === undefined) {
        res.status(400).send("Some parameters are missing.").end();
        return;
    }
    const authController = new AuthController();
    const session = await authController.updateUser(fieldName,fieldValue,id);
    if(session === null) {
        res.status(404).send("Account doesn't exist.").end();
    } else {
        res.status(200).json(session).end();
    }
});

authRouter.get("/user/:id", async function(req, res) {
    const id = req.params.id;
    console.log(id);
    const authController = new AuthController();
    const user = await authController.getUserById(id);
    console.log(user?.firstName);
    res.status(200).json(user).end();
});

authRouter.get("/session/:token", async function(req, res) {
    const token = req.params.token;
    const authController = new AuthController();
    const session = await authController.getSessionByToken(token);
    res.status(200).json(session).end();
});

authRouter.get("/allUsers", async function(req, res) {
    const authController = new AuthController();
    const user = await authController.getAllUsers();
    res.status(200).json(user).end();
});

authRouter.post("/create-payment-intent", async (req, res) => {



    // Create a PaymentIntent with the order amount and currency

    const paymentIntent = await stripe.paymentIntents.create({

        amount: req.body.amount,

        currency: "eur"

    });

    res.send({

        clientSecret: paymentIntent.client_secret

    });

});

authRouter.post("/user/file", async(req: any, res: any) => {
    let file = req.files.fileKey;
    const fs = require('fs');
    try {
        console.log(req.files.fileKey.data);
        fs.writeFile('images/monimage.jpg',file.data, function (err: any) {
            if (err) return console.log(err);
            console.log('Hello World > helloworld.txt');
        });
    }
    catch (err) {
        console.error(err)
    }

    console.log("File uploaded: ", file.name);
    console.log("oh bowdel + " + JSON.stringify(req.body));
});


export {
    authRouter
};
