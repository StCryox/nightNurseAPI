import express from "express";
import { isAuthentified } from "../authentification/auth.middleware";
import { UserController } from "./user.controller";
import bcrypt from "bcrypt";

const userRouter = express.Router();

userRouter.get("/", async function(req, res) {
    const userController = new UserController();
    const userList = await userController.getAllUsers();
    res.status(200).json(userList).end();
});

userRouter.get("/:id", async function(req, res) {
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
    let password = req.body.password;
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

    if(password !== '')
    {
        password = bcrypt.hashSync(password,15);
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

userRouter.get("/file/:fileName", async(req: express.Request, res: express.Response) => {
    let file = 'images/' + req.params.fileName;
    const fs = require('fs');
    try {
        fs.readFile(file, async (err: Error, data: any) => {
            if (err) {
                try {
                    await fs.readFile('images/default.jpg', async (error: Error, defaultData: any) => {
                        if (error) return console.log(error);
                        res.write(defaultData, 'binary');
                        res.status(404).end(null, 'binary');
                    });
                } catch (e) {
                    console.error(e)
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
