import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

// Unified authentication and authorization guard factory
export const protect = (roles: ('contributor' | 'maintainer')[] = []) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // 1. Extract the authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message:
            'Authentication failed: Access token missing or invalid format.',
        });
        return;
      }

      // 2. Isolate the token string from Bearer prefix
      const token = authHeader.split(' ')[1];
      if (!token) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: 'Authentication failed: Token extraction corrupted.',
        });
        return;
      }

      // 3. Authenticate and decode token against environment secret matrix
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string,
      ) as any;

      // 4. Inject validated identification payload inside the request lifecycle
      req.user = decoded;

      // 5. Enforce role-based access restrictions if explicitly targeted
      if (roles.length > 0 && !roles.includes(decoded.role)) {
        res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message:
            'Authorization failed: Your tier lacks adequate scope permissions.',
        });
        return;
      }

      // Proceed seamlessly to the target route controller
      next();
    } catch (error) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message:
          'Authentication failed: Provided session token is either expired or mutated.',
      });
    }
  };
};
