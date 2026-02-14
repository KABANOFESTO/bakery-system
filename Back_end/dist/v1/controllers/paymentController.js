"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = void 0;
const paymentService_1 = require("../services/paymentService");
const apiResponse_1 = require("../utils/apiResponse");
const stripe_config_1 = __importDefault(require("../config/stripe.config"));
const database_1 = require("../config/database");
exports.paymentController = {
    createPayment: async (req, res) => {
        const paymentData = req.body;
        try {
            // Ensure createPayment returns a valid object with an ID
            const payment = await (0, paymentService_1.createPayment)(paymentData);
            if (!payment || !payment.data.id) {
                throw new Error("Payment creation failed, missing payment ID");
            }
            const session = await stripe_config_1.default.checkout.sessions.create({
                line_items: [
                    {
                        price_data: {
                            currency: "usd",
                            product_data: {
                                name: paymentData.planName,
                            },
                            unit_amount: paymentData.planPrice * 100,
                        },
                        quantity: 1,
                    },
                ],
                mode: "payment",
                metadata: {
                    paymentId: payment.data.id, // Ensure it's valid
                    userId: paymentData.userId || "unknown_user", // Default if userId is missing
                },
                success_url: "https://uruyange-coffee-frontend.vercel.app/complete",
                cancel_url: "https://uruyange-coffee-frontend.vercel.app//cancel",
            });
            apiResponse_1.apiResponse.success(res, { sessionUrl: session.url, payment }, 201);
        }
        catch (error) {
            apiResponse_1.apiResponse.error(res, error.message, 500);
        }
    },
    getPayments: async (req, res) => {
        try {
            const payments = await (0, paymentService_1.getPayments)();
            apiResponse_1.apiResponse.success(res, payments);
        }
        catch (error) {
            apiResponse_1.apiResponse.error(res, error.message, 500);
        }
    },
    webhookFunc: async (req, res) => {
        const sig = req.headers["stripe-signature"];
        const endpointSecret = process.env.WEBHOOK_SECRET_KEY;
        let event;
        try {
            event = stripe_config_1.default.webhooks.constructEvent(req.body, sig, endpointSecret);
        }
        catch (err) {
            console.error("Webhook signature verification failed:", err.message);
            res.status(400).send(`Webhook Error: ${err.message}`);
        }
        switch (event.type) {
            case "payment_intent.succeeded":
                const paymentIntent = event.data.object;
                console.log("Payment Intent succeeded:", paymentIntent);
                if (paymentIntent.latest_charge) {
                    const charge = await stripe_config_1.default.charges.retrieve(paymentIntent.latest_charge);
                    if (charge.payment_intent) {
                        const session = await stripe_config_1.default.checkout.sessions.list({
                            payment_intent: charge.payment_intent,
                            limit: 1,
                        });
                        if (session.data.length > 0) {
                            const checkoutSession = session.data[0];
                            const paymentId = checkoutSession.metadata?.paymentId;
                            const subscriptionId = checkoutSession.metadata?.subscriptionId;
                            try {
                                if (subscriptionId) {
                                    // If subscriptionId exists, update Subscription status to ACTIVE
                                    await database_1.prisma.subscriptionUser.update({
                                        where: { id: subscriptionId },
                                        data: { status: "ACTIVE" },
                                    });
                                    console.log(`Subscription ${subscriptionId} set to ACTIVE`);
                                }
                                else if (paymentId) {
                                    // If paymentId exists, update Payment status to PAID
                                    await database_1.prisma.payment.update({
                                        where: { id: paymentId },
                                        data: { status: "PAID" },
                                    });
                                    console.log(`Payment ${paymentId} set to PAID`);
                                }
                                else {
                                    console.warn("No paymentId or subscriptionId found in metadata.");
                                }
                            }
                            catch (error) {
                                console.error("Error updating subscription or payment:", error);
                            }
                        }
                        else {
                            console.warn("No Checkout Session found for this Payment Intent.");
                        }
                    }
                }
                break;
            case "payment_intent.failed":
                console.log("Payment Intent failed:", event.data.object);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
        res.json({ received: true });
    },
};
//# sourceMappingURL=paymentController.js.map