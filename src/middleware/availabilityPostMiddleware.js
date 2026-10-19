import { prisma } from '../lib/prisma.js';

export const availabilityCheck = async (req, res, next) => {
  const postId = req.params.id;
  if (!postId) {
    return res.status(401).json({ message: 'Post doesnt exist' });
  }
  try {
    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        published: true,
      },
    });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    next();
  } catch (err) {
    next(err);
  }
};
