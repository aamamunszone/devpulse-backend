import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware';
import {
  createIssue,
  deleteIssue,
  getAllIssues,
  getIssueById,
  getIssueStats,
  updateIssue,
} from './issues.controller';

const router = Router();

// Base core endpoint distribution
router.post('/', protect(['contributor', 'maintainer']), createIssue);
router.get('/', protect(['contributor', 'maintainer']), getAllIssues);

// Statistical aggregate route (Must remain structurally above the specific ID parameter mapping)
router.get(
  '/stats/summary',
  protect(['contributor', 'maintainer']),
  getIssueStats,
);

// Parameterized individual entity routers
router.get('/:id', protect(['contributor', 'maintainer']), getIssueById);
router.patch('/:id', protect(['maintainer']), updateIssue);
router.delete('/:id', protect(['maintainer']), deleteIssue);

export const IssueRoutes = router;
