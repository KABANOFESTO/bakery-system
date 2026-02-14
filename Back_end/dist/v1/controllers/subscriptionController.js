"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subscriptionService_1 = __importDefault(require("../services/subscriptionService"));
const database_1 = require("../config/database");
const stripe_config_1 = __importDefault(require("../config/stripe.config"));
const subscriptionController = {
    createSubscription: async (req, res) => {
        try {
            const subscriptionData = req.body;
            const subscription = await subscriptionService_1.default.createSubscription(subscriptionData);
            res.status(201).json(subscription);
        }
        catch (error) {
            res.status(500).json({ message: "Error creating subscription", error });
        }
    },
    getSubscriptions: async (req, res) => {
        try {
            const subscriptions = await subscriptionService_1.default.getSubscriptions();
            res.status(200).json(subscriptions);
        }
        catch (error) {
            res.status(500).json({ message: "Error fetching subscriptions", error });
        }
    },
    deleteSubscription: async (req, res) => {
        try {
            const { id } = req.params;
            await subscriptionService_1.default.deleteSubscription(id);
            res.status(200).json({ message: "Subscription deleted successfully" });
        }
        catch (error) {
            res.status(500).json({ message: "Error deleting subscription", error });
        }
    },
    updateSubscription: async (req, res) => {
        try {
            const { id } = req.params;
            const subscriptionData = req.body;
            const updatedSubscription = await subscriptionService_1.default.updateSubscription(id, subscriptionData);
            res.status(200).json(updatedSubscription);
        }
        catch (error) {
            res.status(500).json({ message: "Error updating subscription", error });
        }
    },
    buySubscription: async (req, res) => {
        try {
            const { userId, email, subscriptionId, subscriptionType, type, price, address, city, zipCode, apartment, } = req.body;
            // Validate required fields
            if (!userId || !email || !subscriptionId || !price) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            // Find subscription by name only (since ID lookup is causing issues)
            const subscription = await database_1.prisma.subscription.findFirst({
                where: {
                    name: subscriptionType?.name
                },
            });
            if (!subscription) {
                return res.status(404).json({ message: "Subscription not found" });
            }
            // Check if the user exists
            const user = await database_1.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            // Calculate end date based on subscription type
            let endDate = new Date();
            const subscriptionName = subscription.name.toLowerCase();
            if (subscriptionName.includes("weekly")) {
                endDate.setDate(endDate.getDate() + 7);
            }
            else if (subscriptionName.includes("monthly")) {
                endDate.setMonth(endDate.getMonth() + 1);
            }
            else if (subscriptionName.includes("yearly")) {
                endDate.setFullYear(endDate.getFullYear() + 1);
            }
            // Create subscription record
            const subscriptionUser = await database_1.prisma.subscriptionUser.create({
                data: {
                    userId,
                    email, // Added email field
                    subscriptionId: subscription.id, // Use the found subscription's ID
                    type,
                    startDate: new Date(),
                    endDate,
                    status: "PENDING",
                    address,
                    apartment,
                    city,
                    zipCode,
                },
            });
            // Create Stripe checkout session
            const session = await stripe_config_1.default.checkout.sessions.create({
                payment_method_types: ["card"],
                customer_email: email, // Include email in the Stripe session
                line_items: [
                    {
                        price_data: {
                            currency: "usd",
                            product_data: {
                                name: subscription.name,
                                description: `Subscription: ${subscription.name} (${type})`,
                            },
                            unit_amount: Math.round(price * 100),
                        },
                        quantity: 1,
                    },
                ],
                mode: "payment",
                metadata: {
                    subscriptionUserId: subscriptionUser.id,
                    userId: userId,
                    subscriptionId: subscription.id,
                    type: type,
                    email: email, // Store email in metadata for tracking
                },
                success_url: "https://uruyange-coffee-frontend.vercel.app/complete",
                cancel_url: "https://uruyange-coffee-frontend.vercel.app/cancel",
            });
            return res.json({ sessionUrl: session.url });
        }
        catch (error) {
            console.error("Error buying subscription:", error);
            res.status(500).json({
                message: "Error buying subscription",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    },
    getBoughtSubscription: async (req, res) => {
        try {
            const { userId } = req.params;
            // Get all subscriptions bought by the user with subscription details
            const boughtSubscriptions = await database_1.prisma.subscriptionUser.findMany({
                where: {
                    userId,
                },
                include: {
                    subscription: true, // Include the related subscription details
                },
                orderBy: {
                    startDate: 'desc', // Order by most recent first
                },
            });
            res.status(200).json(boughtSubscriptions);
        }
        catch (error) {
            console.error("Error fetching bought subscriptions:", error);
            res.status(500).json({ message: "Error fetching bought subscriptions", error });
        }
    },
};
exports.default = subscriptionController;
//# sourceMappingURL=subscriptionController.js.map