import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

// Catch-all middleware for handling undefined endpoints (404 Not Found)
const notFound = (req: Request, res: Response, next: NextFunction): void => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: `API Route Not Found: Cannot ${req.method} ${req.originalUrl}`,
  });
};

export default notFound;
