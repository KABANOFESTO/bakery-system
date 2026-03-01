import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
    user?: {
        role: string;
    };
}

const roleMiddleware = (role: string) => {
    return (req: CustomRequest, res: Response, next: NextFunction) => {
        if (!req.user || req.user.role !== role) {
            res.status(403).json({ message: 'Access denied' });
            return;
        }
        next();
    };
};

export default roleMiddleware;
