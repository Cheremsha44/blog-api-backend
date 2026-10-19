import express from 'express';
import {
  deleteComment,
  updateComment,
} from '../controllers/commentController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { authorCommentCheck } from '../middleware/authorCommentMiddleware.js';

const commentRouter = express.Router();

commentRouter.delete('/:id', requireAuth, authorCommentCheck, deleteComment);
commentRouter.patch('/:id', requireAuth, authorCommentCheck, updateComment);

export default commentRouter;
