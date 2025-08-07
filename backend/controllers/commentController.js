const { pool } = require('../config/database');
const { body, validationResult } = require('express-validator');

// Validation rules
const createCommentValidation = [
  body('content').notEmpty().withMessage('Comment content is required')
];

// Get comments for a post
const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const [comments] = await pool.execute(
      `SELECT c.*, u.full_name as author_name, u.profile_picture as author_picture
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.post_id = ? AND c.is_active = true
       ORDER BY c.created_at ASC
       LIMIT ? OFFSET ?`,
      [postId, parseInt(limit), offset]
    );

    // Get total count
    const [countResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM comments WHERE post_id = ? AND is_active = true',
      [postId]
    );

    const total = countResult[0].total;

    res.json({
      comments,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create comment
const createComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    // Check if post exists
    const [posts] = await pool.execute(
      'SELECT * FROM posts WHERE id = ? AND is_active = true',
      [postId]
    );

    if (posts.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const [result] = await pool.execute(
      `INSERT INTO comments (content, user_id, post_id, is_active, created_at, updated_at)
       VALUES (?, ?, ?, true, NOW(), NOW())`,
      [content, userId, postId]
    );

    // Get created comment
    const [comments] = await pool.execute(
      `SELECT c.*, u.full_name as author_name, u.profile_picture as author_picture
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      message: 'Comment created successfully',
      comment: comments[0]
    });

  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update comment
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    // Check if comment exists and belongs to user
    const [comments] = await pool.execute(
      'SELECT * FROM comments WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (comments.length === 0) {
      return res.status(404).json({ error: 'Comment not found or unauthorized' });
    }

    const [result] = await pool.execute(
      'UPDATE comments SET content = ?, updated_at = NOW() WHERE id = ? AND user_id = ?',
      [content, id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ error: 'Failed to update comment' });
    }

    // Get updated comment
    const [updatedComments] = await pool.execute(
      `SELECT c.*, u.full_name as author_name, u.profile_picture as author_picture
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [id]
    );

    res.json({
      message: 'Comment updated successfully',
      comment: updatedComments[0]
    });

  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete comment
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [result] = await pool.execute(
      'UPDATE comments SET is_active = false WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Comment not found or unauthorized' });
    }

    res.json({ message: 'Comment deleted successfully' });

  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  createCommentValidation
}; 