"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const roleMiddleware = (role) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            res.status(403).json({ message: 'Access denied' });
            return;
        }
        next();
    };
};
exports.default = roleMiddleware;
//# sourceMappingURL=roleMiddleware.js.map