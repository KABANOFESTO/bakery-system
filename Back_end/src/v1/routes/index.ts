import { Router } from "express";

import user from "./userRoutes";
import coffee from "./coffeeRoutes";
import subscription from "./subscriptionRoutes";
import payment from "./paymentRoutes";
import message from "./messageRoutes";
import stock from "./stockRoutes";
import rawMaterial from "./rawMaterialRoutes";
import dailySale from "./dailySaleRoutes";
import dailyProduction from "./dailyProductionRoutes";

const route: Router = Router();

route.use("/", user);
route.use("/", coffee);
route.use("/", subscription);
route.use("/", payment);
route.use("/", message);
route.use("/", stock);
route.use("/", rawMaterial);
route.use("/", dailySale);
route.use("/", dailyProduction);

route.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found.",
    });
});

export default route;
