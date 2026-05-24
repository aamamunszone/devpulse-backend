import { Router } from 'express';
import { login, signup } from './auth.controller';

const router = Router();

// Route mappings aligned with specifications
router.post('/signup', signup);
router.post('/login', login);

export const AuthRoutes = router;
