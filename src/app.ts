import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { AuthRoutes } from './app/modules/auth/auth.routes';

const app: Application = express();

// Global Middlewares
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  }),
);
app.use(express.json());

// Application Routing Matrix
app.use('/api/auth', AuthRoutes);

// Root entry server status check
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to DevPulse API Server',
  });
});

export default app;
