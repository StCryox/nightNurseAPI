import express from "express";
import { BookingController } from "../controllers/booking.controller";
import { isAuthentified } from "../middlewares/auth.middleware";

const bookingRouter = express.Router();

bookingRouter.get("/", isAuthentified, async function(req, res) {
    const bookingController = new BookingController();
    // Get UserID via token
    const userId: string = "";
    const userBooking = await bookingController.getUserBooking(userId);
    res.status(200).json(userBooking).end();
});

bookingRouter.post("/", isAuthentified, async function(req, res) {
    const userId = req.body.description;
    const providerId = req.body.images;
    const date = req.body.type;

    if( userId === undefined 
        || providerId === undefined 
        || date === undefined) {
        res.status(400).send("Some parameters are missing.").end();
        return;
    }

    const bookingController = new BookingController();

    const booking = await bookingController.book({
        userId,
        providerId,
        date
    });

    res.status(201);
    res.json(booking);
  
});

bookingRouter.put("/:id", isAuthentified, async function(req, res) {
    const id = req.params.id;
    const userId = req.body.description;
    const providerId = req.body.images;
    const date = req.body.type;

    if( id === undefined 
        || userId === undefined 
        || providerId === undefined 
        || date === undefined) {
        res.status(400).send("Some parameters are missing.").end();
        return;
    }
    const bookingController = new BookingController();

    const booking = await bookingController.updateBooking(id, {
        userId,
        providerId,
        date
    });

    res.status(201);
    res.json(booking);

});

bookingRouter.delete("/:id", isAuthentified, async function(req, res) {
    const bookingController = new BookingController();
    const result = await bookingController.removeBooking(req.params.id);
    res.status(200).json(result).end();
});

export {
    bookingRouter
};
