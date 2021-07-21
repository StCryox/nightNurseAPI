import express from "express";
import {AuthController} from "../controllers/auth.controller";

export async function isAuthentified(req: express.Request, res: express.Response, next: express.NextFunction) {
    const auth = req.headers["authorization"];
    if(auth !== undefined) {
        const token = auth.slice(7);
        const authController = new AuthController();
        const session = await authController.getSession(token);
        if(session !== null) {
            next();
            return;
        } else {
            res.status(404).send("You're not logged in.").end();
            return;
        }
    } else {
        res.status(401).send("Access denied").end();
    }
}


export async function isAdministrator(req: express.Request, res: express.Response, next: express.NextFunction) {
    const auth = req.headers["authorization"];
    if(auth !== undefined) {
        const token = auth.slice(7);
        const admin = token.substring(0, 5);
        console.log(admin);
        if(admin === "minad") {
            next();
            return;
        } else {
            res.status(403).send("You must be an admin to continue.").end();
            return;
        }
    } else {
        res.status(401).send("Access denied").end();
    }
}

export async function isProvider(req: express.Request, res: express.Response, next: express.NextFunction) {
    const auth = req.headers["authorization"];
    const id = req.params.id;
    if(auth !== undefined) {
        const token = auth.slice(7);
        const provider = token.substring(0, 5);
        console.log(provider);
        if(provider === "vider") {
            const authController = new AuthController();
            let providerId = await authController.getProviderId(id);
            if(providerId == id){
                next();
            }
            return;
        } else {
            res.status(403).send("You must be a provider to continue.").end();
            return;
        }
    } else {
        res.status(401).send("Access denied").end();
    }
}