"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentDTO = exports.createPaymentDTO = void 0;
const createPaymentDTO = (payment) => ({
    email: payment.email,
    firstName: payment.firstName ?? '',
    lastName: payment.lastName ?? '',
    address: payment.address,
    apartment: payment.apartment ?? undefined,
    city: payment.city,
    zipCode: payment.zipCode,
    phone: payment.phone,
    textOffers: payment.textOffers,
    planName: payment.planName,
    planPrice: payment.planPrice,
    userId: payment.userId ?? null,
    subscriptionId: payment.subscriptionId ?? null,
    paymentMethod: payment.paymentMethod ?? '',
    coffeeType: payment.coffeeType ?? undefined,
    roastPreference: payment.roastPreference ?? undefined,
});
exports.createPaymentDTO = createPaymentDTO;
const getPaymentDTO = (payment) => ({
    id: payment.id,
    email: payment.email,
    planName: payment.planName,
    planPrice: Number(payment.planPrice),
    paymentDate: payment.paymentDate ? payment.paymentDate.toISOString() : undefined,
    paymentMethod: payment.paymentMethod ?? 'Unknown',
    coffeeType: payment.coffeeType,
    roastPreference: payment.roastPreference,
});
exports.getPaymentDTO = getPaymentDTO;
//# sourceMappingURL=paymentDTO.js.map