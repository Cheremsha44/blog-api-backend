import { prisma } from '../lib/prisma.js';

export const getAllPosts = async (req, res, next) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    if (!Number.isInteger(page) || !Number.isInteger(limit)) {
      return res
        .status(400)
        .json({ message: 'Page and limit must be integers' });
    }
    if (page < 1 || limit < 1) {
      return res
        .status(400)
        .json({ message: 'Page and limit must be positive' });
    }
    if (limit > 100 || page > 10000) {
      return res.status(400).json({ message: 'Page or limit is too large' });
    }

    const where = { published: true };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          createdAt: true,
          author: { select: { id: true, name: true } },
          _count: { select: { comments: true } },
        },
      }),
      prisma.post.count({ where }),
    ]);

    res.status(200).json({
      posts,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

export const getMyPosts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const posts = await prisma.post.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const { title, content, published } = req.body;
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: 'Title and content are required' });
    }
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        published: published ?? false,
        authorId: req.user.id,
      },
      include: {
        author: {
          select: { id: true, name: true },
        },
      },
    });
    res.status(201).json(newPost);
  } catch (err) {
    next(err);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { title, content, published } = req.body;

    const dataToUpdate = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (content !== undefined) dataToUpdate.content = content;
    if (published !== undefined) dataToUpdate.published = published;

    const updatedPost = await prisma.post.update({
      where: { id: req.params.id },
      data: dataToUpdate,
    });
    res.status(200).json(updatedPost);
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const deletedPost = await prisma.post.delete({
      where: { id: req.params.id },
    });
    res.status(200).json(deletedPost);
  } catch (err) {
    next(err);
  }
};

export const createComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const postId = req.params.id;
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }
    const newComment = await prisma.comment.create({
      data: {
        content,
        authorId: req.user.id,
        postId: postId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    res.status(201).json(newComment);
  } catch (err) {
    next(err);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      return res.status(400).json({ message: 'Post ID is required' });
    }
    const comments = await prisma.comment.findMany({
      where: {
        postId: postId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    res.json(comments);
  } catch (err) {
    next(err);
  }
};
