import { prisma } from '../lib/prisma.js';

export const deleteComment = async (req, res, next) => {
  try {
    const commentId = req.params.id;
    if (!commentId) {
      return res.status(400).json({ message: 'Comment ID is required' });
    }
    await prisma.comment.delete({
      where: { id: commentId },
    });
    res.status(204).json({ message: 'Comment deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const commentId = req.params.id;
    const { content } = req.body;
    if (!commentId) {
      return res.status(400).json({ message: 'Comment ID is required' });
    }
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    res.status(200).json(updatedComment);
  } catch (err) {
    next(err);
  }
};
