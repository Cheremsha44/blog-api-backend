import express from 'express';
import {
  getAllPosts,
  getPostById,
  getMyPosts,
  createPost,
  updatePost,
  deletePost,
  createComment,
  getComments,
} from '../controllers/postController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { authorCheck } from '../middleware/authorCheckMiddleware.js';
import { availabilityCheck } from '../middleware/availabilityPostMiddleware.js';

const postRouter = express.Router();

postRouter.get('/', getAllPosts);
postRouter.get('/mine', requireAuth, getMyPosts);
postRouter.get('/:id', getPostById);
postRouter.post('/', requireAuth, createPost);
postRouter.patch('/:id', requireAuth, authorCheck, updatePost);
postRouter.delete('/:id', requireAuth, authorCheck, deletePost);
postRouter.post('/:id/comments', requireAuth, availabilityCheck, createComment);
postRouter.get('/:id/comments', requireAuth, getComments);

export default postRouter;
