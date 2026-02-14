"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRoutes_1 = __importDefault(require("./userRoutes"));
const coffeeRoutes_1 = __importDefault(require("./coffeeRoutes"));
const subscriptionRoutes_1 = __importDefault(require("./subscriptionRoutes"));
const paymentRoutes_1 = __importDefault(require("./paymentRoutes"));
const messageRoutes_1 = __importDefault(require("./messageRoutes"));
const stockRoutes_1 = __importDefault(require("./stockRoutes"));
const rawMaterialRoutes_1 = __importDefault(require("./rawMaterialRoutes"));
const dailySaleRoutes_1 = __importDefault(require("./dailySaleRoutes"));
const dailyProductionRoutes_1 = __importDefault(require("./dailyProductionRoutes"));
const route = (0, express_1.Router)();
route.use("/", userRoutes_1.default);
route.use("/", coffeeRoutes_1.default);
route.use("/", subscriptionRoutes_1.default);
route.use("/", paymentRoutes_1.default);
route.use("/", messageRoutes_1.default);
route.use("/", stockRoutes_1.default);
route.use("/", rawMaterialRoutes_1.default);
route.use("/", dailySaleRoutes_1.default);
route.use("/", dailyProductionRoutes_1.default);
route.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found.",
    });
});
exports.default = route;
//# sourceMappingURL=index.js.map