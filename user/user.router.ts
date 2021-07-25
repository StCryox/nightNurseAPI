import express from "express";
import { isAuthentified } from "../authentification/auth.middleware";
import { UserController } from "./user.controller";
import {TextDecoder} from "util";

const userRouter = express.Router();

userRouter.get("/", isAuthentified, async function(req, res) {
    const userController = new UserController();
    const userList = await userController.getAllUsers();
    res.status(200).json(userList).end();
});

userRouter.get("/:id", isAuthentified, async function(req, res) {
    const id = req.params.id;
    const userController = new UserController();
    const user = await userController.getUserById(id);
    res.status(200).json(user).end();
});

userRouter.post("/update/:id", isAuthentified, async function(req, res) {
    const id = req.params.id;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const mail = req.body.mail;
    const login = req.body.login;
    const password = req.body.password;
    const image = req.body.image;
    const birthdate = req.body.birthdate;
    const role = req.body.role;
    const address = req.body.address;
    const zipcode = req.body.zipcode;
    const city = req.body.city;
    const province = req.body.province;
    const phoneNumber = req.body.phoneNumber;

    
    if( id === undefined
        || firstName === undefined 
        || lastName === undefined 
        || mail === undefined 
        || login === undefined 
        || password === undefined 
        || image === undefined 
        || birthdate === undefined 
        || role === undefined 
        || address === undefined 
        || zipcode === undefined 
        || city === undefined
        || province === undefined 
        || phoneNumber === undefined) {
        res.status(400).send("Some parameters are missing.").end();
        return;
    }

    const userController = new UserController();

    const user = await userController.updateUser(id, {
        id,
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
        city,
        province,
        phoneNumber
    });

    res.status(201);
    res.json(user);
});

userRouter.get("/session/:token", async function(req, res) {
    const token = req.params.token;
    const userController = new UserController();
    const session = await userController.getSession(token);
    res.status(200).json(session).end();
});

userRouter.delete("/:id", isAuthentified, async function(req, res) {
    const userController = new UserController();
    const result = await userController.removeUser(req.params.id);
    res.status(200).json(result).end();
});

userRouter.get("/file/:fileName", async(req: any, res: any) => {
    let file = 'images/' + req.params.fileName;
    let finaleData = '';
    const fs = require('fs');
    try {
        fs.readFile(file, async (err: any, data: any) => {
            if (err) {
                try {
                    await fs.readFile('images/default.jpg', async (error: any, defaultData: any) => {
                        if (error) return console.log(error);
                        await res.write(defaultData, 'binary');
                        await res.status(404).end(null, 'binary');
                    });
                } catch (err) {
                    console.error(err)
                }
            }
            if (data !== undefined) {//si image pas trouvée, on met l'image par défaut
                res.write(data, 'binary');
                res.status(200).end(null, 'binary');
            }
        });

    } catch (err) {
    }
});

userRouter.post("/file", async(req: any, res: any) => {
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
    userRouter
};
