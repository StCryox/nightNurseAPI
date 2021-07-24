import express from "express";
import { isAuthentified } from "../authentification/auth.middleware";
import { BookingController } from "./booking.controller";

const bookingRouter = express.Router();

const stripe = require("stripe")("sk_test_51JFzBbFJFVSlloUZiKyxrzKKlUz6oPGW2kphACoTGYBy9yvuDefscMBCgjXixu6UFntDU0dO5wcRmgftkPliTkeV00ULwbWv3p");

bookingRouter.get("/", isAuthentified, async function(req, res) {
    const bookingController = new BookingController();
    const bookings = await bookingController.getAllBookings();
    res.status(200).json(bookings).end();
});

bookingRouter.get("/userBookings/:userId", isAuthentified, async function(req, res) {
    const userId: string = req.body.userId;
    const bookingController = new BookingController();
    const userBookings = await bookingController.getAllUserBookingsById(userId);
    res.status(200).json(userBookings).end();
});

bookingRouter.get("/booking/:id", isAuthentified, async function(req, res) {
    const id: string = req.body.id;
    const bookingController = new BookingController();
    const booking = await bookingController.getBooking(id);
    res.status(200).json(booking).end();
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

bookingRouter.post("/create-payment-intent", async (req, res) => {

    const { items } = req.body;

    // Create a PaymentIntent with the order amount and currency

    const paymentIntent = await stripe.paymentIntents.create({

        amount: items['amount'],

        currency: "eur"

    });

    res.send({

        clientSecret: paymentIntent.client_secret

    });

});

export {
    bookingRouter
};
