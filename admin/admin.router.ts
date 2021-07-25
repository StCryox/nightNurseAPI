import express from "express";
import { isAdministrator, isAuthentified } from "../authentification/auth.middleware";
import { AdminController } from "./admin.controller";

const adminRouter = express.Router();

adminRouter.put("/:id", isAuthentified, isAdministrator, async function(req, res) {
    const userId = req.params.id;
    const verified = req.body.verified;
    
    if( userId === undefined
        || verified === undefined) {
        res.status(400).send("Some parameters are missing.").end();
        return;
    }

    const adminController = new AdminController();

    const result = await adminController.verifyDiploma(userId, verified);

    res.status(201);
    res.json(result);

});

export {
    adminRouter
};
