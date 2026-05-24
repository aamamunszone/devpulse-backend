import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      // Extend the Express Request interface to securely hold decoded JWT payloads
      user?:
        | {
            id: number;
            name: string;
            role: 'contributor' | 'maintainer';
          }
        | JwtPayload;
    }
  }
}
