import { prisma } from '../lib/prisma.js';

export const authorCommentCheck = async (req, res, next) => {
  const commentId = req.params.id;
  if (!commentId) {
    return res.status(401).json({ message: 'Comment doesnt exist' });
  }
  try {
    const comment = await prisma.comment.findFirst({
      where: {
        id: commentId,
        authorId: req.user.id,
      },
    });
    if (!comment) {
      return res.status(404).send('Comment not found');
    }
    next();
  } catch (err) {
    next(err);
  }
};
