import { prisma } from '../lib/prisma.js';

export const authorCheck = async (req, res, next) => {
  const postId = req.params.id;
  if (!postId) {
    return res.status(401).json({ message: 'Post doesnt exist' });
  }
  try {
    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        authorId: req.user.id,
      },
    });
    if (!post) {
      return res.status(404).send('Post not found');
    }
    next();
  } catch (err) {
    next(err);
  }
};
