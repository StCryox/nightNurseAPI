import { Express } from "express";
import { authRouter } from "../authentification/auth.router";
import { userRouter } from "../user/user.router";
import { bookingRouter } from "../booking/booking.route";
import { providerRouter } from "../provider/provider.route";
import { adminRouter } from "../admin/admin.router";

export function buildRoutes(app: Express) {
    app.get("/", async function(req, res) {
        res.send("NightNurse API.");
    });

    app.use("/auth", authRouter);

    app.use("/user", userRouter);

    app.use("/provider", providerRouter);

    app.use("/booking", bookingRouter);

    app.use("/admin", adminRouter);
}
