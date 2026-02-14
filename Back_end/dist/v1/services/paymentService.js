"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.proceedPayment = exports.getPaymentById = exports.getPayments = exports.createPayment = void 0;
const paymentDTO_1 = require("../DTOs/paymentDTO");
const stripe_1 = __importDefault(require("stripe"));
const database_1 = require("../config/database");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-02-24.acacia",
});
const createPayment = async (paymentData) => {
    try {
        const completePaymentData = {
            ...paymentData,
            paymentMethod: paymentData.paymentMethod || 'Unknown', // Provide a default if null
        };
        const payment = await database_1.prisma.payment.create({
            data: completePaymentData
        });
        if (payment) {
            return { success: true, data: payment };
        }
        return { success: false };
    }
    catch (error) {
        console.error("Error creating payment:", error);
        return { success: false, message: "Payment creation failed", error };
    }
};
exports.createPayment = createPayment;
const getPayments = async () => {
    try {
        const payments = await database_1.prisma.payment.findMany();
        if (!payments || payments.length === 0) {
            return { success: false, message: "No payments found", statusCode: 404 };
        }
        return { success: true, payments: payments.map(paymentDTO_1.getPaymentDTO) };
    }
    catch (error) {
        console.error("Error fetching payments:", error);
        return { success: false, message: "Failed to retrieve payments", error };
    }
};
exports.getPayments = getPayments;
const getPaymentById = async (id) => {
    try {
        const payment = await database_1.prisma.payment.findUnique({ where: { id } });
        if (!payment) {
            return { success: false, message: "Payment not found", statusCode: 404 };
        }
        return { success: true, payment: (0, paymentDTO_1.getPaymentDTO)(payment) };
    }
    catch (error) {
        console.error("Error fetching payment:", error);
        return { success: false, message: "Failed to retrieve payment", error };
    }
};
exports.getPaymentById = getPaymentById;
const proceedPayment = async (data) => {
    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: data.planName,
                        },
                        unit_amount: data.planPrice
                    },
                    quantity: 1
                },
            ],
            mode: "payment",
            success_url: "http://localhost:3000/complete",
            cancel_url: "http://localhost:3000/complete",
        });
        console.log("session", session);
        return session;
    }
    catch (error) { }
};
exports.proceedPayment = proceedPayment;
//# sourceMappingURL=paymentService.js.map