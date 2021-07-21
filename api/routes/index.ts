import { Express } from "express";
import { authRouter } from "./auth.router";
import { providerRouter } from "./provider.route";
import { bookingRouter } from "./booking.route";

export function buildRoutes(app: Express) {
    app.get("/", async function(req, res) {
        res.send("NightNurse API.");
    });

    app.use("/auth", authRouter);

    app.use("/provider", providerRouter);

    app.use("/booking", bookingRouter);

    app.use("/admin", bookingRouter);
}
