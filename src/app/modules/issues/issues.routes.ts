import { Router } from 'express';
import { protect } from '../../middleware/auth.middleware';
import {
  createIssue,
  deleteIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
} from './issues.controller';

const router = Router();

// Endpoint matrix mappings managed securely via authentication guards
router.post('/', protect(['contributor', 'maintainer']), createIssue);
router.get('/', protect(['contributor', 'maintainer']), getAllIssues);
router.get('/:id', protect(['contributor', 'maintainer']), getIssueById);

// Advanced administrative overrides isolated safely for maintainers only
router.patch('/:id', protect(['maintainer']), updateIssue);
router.delete('/:id', protect(['maintainer']), deleteIssue);

export const IssueRoutes = router;
