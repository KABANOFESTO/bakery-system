"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SubscriptionDTO = {
    createSubscriptionDTO: (subscription) => ({
        name: subscription.name,
        price: subscription.price,
        userId: subscription.userId,
        email: subscription.email, // Added email field
    }),
    getSubscriptionDTO: (subscription) => ({
        id: subscription.id,
        name: subscription.name,
        price: subscription.price,
        createdAt: subscription.createdAt,
        email: subscription.email, // Added email field
    })
};
exports.default = SubscriptionDTO;
//# sourceMappingURL=subscriptionDTO.js.map