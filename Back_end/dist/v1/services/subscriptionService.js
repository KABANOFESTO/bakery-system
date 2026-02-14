"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subscriptionDTO_1 = __importDefault(require("../DTOs/subscriptionDTO"));
const database_1 = require("../config/database");
const subscriptionService = {
    createSubscription: async (subscriptionData) => {
        const subscription = await database_1.prisma.subscription.create({ data: subscriptionData });
        return subscriptionDTO_1.default.getSubscriptionDTO(subscription);
    },
    getSubscriptions: async () => {
        const subscriptions = await database_1.prisma.subscription.findMany();
        return subscriptions.map(subscriptionDTO_1.default.getSubscriptionDTO);
    },
    deleteSubscription: async (id) => {
        await database_1.prisma.subscription.delete({ where: { id } });
    },
    updateSubscription: async (id, subscriptionData) => {
        const updatedSubscription = await database_1.prisma.subscription.update({
            where: { id },
            data: subscriptionData
        });
        return subscriptionDTO_1.default.getSubscriptionDTO(updatedSubscription);
    },
    // New methods for handling bought subscriptions
    buySubscription: async (subscriptionUserData) => {
        // Get subscription details to calculate end date
        const subscription = await database_1.prisma.subscription.findUnique({
            where: { id: subscriptionUserData.subscriptionId }
        });
        if (!subscription) {
            throw new Error('Subscription not found');
        }
        // Calculate end date based on subscription duration
        let endDate = new Date();
        if (subscription.name.toLowerCase().includes("week")) {
            endDate.setDate(endDate.getDate() + 7);
        }
        else if (subscription.name.toLowerCase().includes("month")) {
            endDate.setMonth(endDate.getMonth() + 1);
        }
        else if (subscription.name.toLowerCase().includes("year")) {
            endDate.setFullYear(endDate.getFullYear() + 1);
        }
        // Create the subscription user record
        const subscriptionUser = await database_1.prisma.subscriptionUser.create({
            data: {
                userId: subscriptionUserData.userId,
                subscriptionId: subscriptionUserData.subscriptionId,
                type: subscriptionUserData.type,
                email: subscriptionUserData.email ?? "", // Added email field
                startDate: new Date(),
                endDate,
                status: "PENDING",
                address: subscriptionUserData.address ?? "",
                apartment: subscriptionUserData.apartment,
                city: subscriptionUserData.city ?? "",
                zipCode: subscriptionUserData.zipCode ?? ""
            }
        });
        return subscriptionUser;
    },
    getBoughtSubscriptions: async (userId) => {
        const subscriptions = await database_1.prisma.subscriptionUser.findMany({
            where: { userId },
            include: {
                subscription: true
            },
            orderBy: {
                startDate: 'desc'
            }
        });
        return subscriptions;
    },
    getSubscriptionUserById: async (id) => {
        return await database_1.prisma.subscriptionUser.findUnique({
            where: { id },
            include: {
                subscription: true,
                user: {
                    select: {
                        id: true,
                        email: true // Ensures email is included
                    }
                }
            }
        });
    },
    checkActiveSubscription: async (userId) => {
        const currentDate = new Date();
        return await database_1.prisma.subscriptionUser.findFirst({
            where: {
                userId,
                status: 'ACTIVE',
                endDate: {
                    gte: currentDate
                }
            },
            include: {
                subscription: true
            }
        });
    }
};
exports.default = subscriptionService;
//# sourceMappingURL=subscriptionService.js.map