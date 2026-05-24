import express, { Application, Request, Response } from 'express';
import cors from 'cors';

const app: Application = express();

// Middleware
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  }),
);

app.use(express.json());

// Basic test route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to DevPulse API Server',
  });
});

export default app;
