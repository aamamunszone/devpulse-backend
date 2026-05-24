import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { AuthRoutes } from './app/modules/auth/auth.routes';
import { IssueRoutes } from './app/modules/issues/issues.routes';

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

// Application Routing Matrix Configurations
app.use('/api/auth', AuthRoutes);
app.use('/api/issues', IssueRoutes);

// Root entry server status check
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to DevPulse API Server',
  });
});

export default app;
