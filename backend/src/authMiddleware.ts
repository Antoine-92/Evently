import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Replace with your JWT secret
const jwtSecret = 'your-secret-key';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        (req as any).user = decoded; // Add the decoded user info to the request object
        next(); // Proceed to the next middleware or route
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token.' });
    }
};
