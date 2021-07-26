import express from "express";
import { isAuthentified } from "../authentification/auth.middleware";
import { BookingController } from "./booking.controller";
import {v4 as uuidv4} from 'uuid'
import {ProviderController} from "../provider/provider.controller";
import {Pricing} from "../provider/data-layer/model/pricing.model";

const bookingRouter = express.Router();

const stripe = require("stripe")("sk_test_51JFzBbFJFVSlloUZiKyxrzKKlUz6oPGW2kphACoTGYBy9yvuDefscMBCgjXixu6UFntDU0dO5wcRmgftkPliTkeV00ULwbWv3p");

bookingRouter.get("/", isAuthentified, async function(req, res) {
    const bookingController = new BookingController();
    const bookings = await bookingController.getAllBookings();
    res.status(200).json(bookings).end();
});

bookingRouter.get("/userBookings/:userId", isAuthentified, async function(req, res) {
    const userId: string = req.params.userId;
    const bookingController = new BookingController();
    const userBookings = await bookingController.getAllUserBookingsById(userId);
    res.status(200).json(userBookings).end();
});

bookingRouter.get("/providerBookings/:userId", isAuthentified, async function(req, res) {
    const userId: string = req.params.userId;
    const bookingController = new BookingController();
    const providerController = new ProviderController();
    const provider = await providerController.getOneProviderByUserId(userId);
    const userBookings = await bookingController.getAllProviderBookingsById(provider?.id);
    res.status(200).json(userBookings).end();
});

bookingRouter.get("/provider/date", isAuthentified, async function(req, res) {
    const providerId: string = req.body.providerId;
    const date: string = req.body.date;
    const bookingController = new BookingController();
    const userBookings = await bookingController.getAllProviderBookingsByIdAndDate(providerId, date);
    res.status(200).json(userBookings).end();
});

bookingRouter.get("/booking/:id", isAuthentified, async function(req, res) {
    const id: string = req.body.id;
    const bookingController = new BookingController();
    const booking = await bookingController.getBooking(id);
    res.status(200).json(booking).end();
});

bookingRouter.post("/", isAuthentified, async function(req, res) {
    console.log(req.body);
    const userId = req.body.userId;
    const providerId = req.body.providerId;
    const date = req.body.date;
    const pricingId = req.body.pricingId;
    if( userId === undefined 
        || providerId === undefined 
        || date === undefined
        || pricingId === undefined) {
        res.status(400).send("Some parameters are missing.").end();
        return;
    }
    const bookingController = new BookingController();
    const id = uuidv4();
    const booking = await bookingController.book({
        id,
        userId,
        providerId,
        pricingId,
        date
    });
    console.log(JSON.stringify(booking));

    res.status(201);
    res.json(booking);
  
});

bookingRouter.put("/:id", isAuthentified, async function(req, res) {
    const id = req.params.id;
    const userId = req.body.description;
    const providerId = req.body.images;
    const date = req.body.type;
    const pricingId = req.body.pricingId;
    const userMail = req.body.mail;
    const providerMail = req.body.providerMail;

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
        date,
        pricingId
    });
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nightnurse.pa@gmail.com',
            pass: 'vTFA7dnTgKMTEGZ'
        }
    });

    var mailOptions = {
        from: 'nightnurse.pa@gmail.com',
        to: userMail,
        bcc: 'nightnurse.pa@gmail.com',
        subject: `Demande de modification de la réservation #${id}`,
        text: `Bonjour,\nLa commande ${id} a été modifiée.\nVous pouvez dès à présent voir les modifications sur notre site.`
    };

    transporter.sendMail(mailOptions, function(error: any, info: { response: string; }){
        if (error) {
            console.log(error);
        } else {
            console.log('Email 1 sent: ' + info.response);
        }
    });

    mailOptions.to = providerMail;
    transporter.sendMail(mailOptions, function(error: any, info: { response: string; }){
        if (error) {
            console.log(error);
        } else {
            console.log('Email 2 sent: ' + info.response);
        }
    });

    res.status(201);
    res.json(booking);

});

bookingRouter.delete("/:id", isAuthentified, async function(req, res) {
    const bookingController = new BookingController();
    const result = await bookingController.removeBooking(req.params.id);
    res.status(200).json(result).end();
});

bookingRouter.post("/create-payment-intent", isAuthentified,async (req, res) => {

    const  items = req.body;

    // Create a PaymentIntent with the order amount and currency

    const paymentIntent = await stripe.paymentIntents.create({

        amount: items.amount,

        currency: "eur"

    });

    res.send({

        clientSecret: paymentIntent.client_secret

    });

});

bookingRouter.post("/mail/update", isAuthentified, async function(req, res) {
    const userMail = req.body.mail;
    const bookingId = req.body.bookingId;
    const providerMail = req.body.providerMail;
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nightnurse.pa@gmail.com',
            pass: 'vTFA7dnTgKMTEGZ'
        }
    });

    var mailOptions = {
        from: 'nightnurse.pa@gmail.com',
        to: userMail,
        bcc: 'nightnurse.pa@gmail.com',
        subject: `Demande de modification de la réservation #${bookingId}`,
        text: 'Bonjour,\nVous avez demandé à changer les données de votre commande.\nCe message a été transmis au prestataire concerné.'
    };

    transporter.sendMail(mailOptions, function(error: any, info: { response: string; }){
        if (error) {
            console.log(error);
        } else {
            console.log('Email 1 sent: ' + info.response);
        }
    });

    mailOptions.to = providerMail;
    mailOptions.text = `Bonjour,\nUne demande de modification a été effectuée pour la commande ${bookingId},` +
        ` vous pouvez la modifier maintenant, ou envoyer un mail à l'utilisateur à cette addresse : ${userMail}`;

    transporter.sendMail(mailOptions, function(error: any, info: { response: string; }){
        if (error) {
            console.log(error);
        } else {
            console.log('Email 2 sent: ' + info.response);
        }
    });

    res.send('Mails envoyé').status(201).end();

});



export {
    bookingRouter
};
