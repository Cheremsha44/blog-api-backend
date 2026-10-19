import express from 'express';
import {
  getAllPosts,
  getPostById,
  getMyPosts,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/postController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { authorCheck } from '../middleware/authorCheckMiddleware.js';

const postRouter = express.Router();

postRouter.get('/', getAllPosts);
postRouter.get('/mine', requireAuth, getMyPosts);
postRouter.get('/:id', getPostById);
postRouter.post('/', requireAuth, createPost);
postRouter.patch('/:id', requireAuth, authorCheck, updatePost);
postRouter.delete('/:id', requireAuth, authorCheck, deletePost);

export default postRouter;
