const { pool } = require('../config/database');
const { body, validationResult } = require('express-validator');

// Validation rules
const createPostValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').isIn(['HELP_REQUEST', 'HELP_OFFER', 'BUY_SELL', 'BUSINESS', 'SERVICE', 'JOB_GIG', 'EVENT', 'ANNOUNCEMENT', 'LOST_FOUND', 'VOLUNTEER']).withMessage('Invalid category'),
  body('type').isIn(['REQUEST', 'OFFER', 'ANNOUNCEMENT']).withMessage('Invalid type')
];

// Get all posts with filters
const getPosts = async (req, res) => {
  try {
    const { category, communityId, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.*, u.full_name as author_name, u.profile_picture as author_picture,
             c.name as community_name, c.community_code
      FROM posts p
      JOIN users u ON p.user_id = u.id
      JOIN communities c ON p.community_id = c.id
      WHERE p.is_active = true
    `;
    const params = [];

    if (category && category !== 'ALL') {
      query += ' AND p.category = ?';
      params.push(category);
    }

    if (communityId) {
      query += ' AND p.community_id = ?';
      params.push(communityId);
    }

    if (search) {
      query += ' AND (p.title LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [posts] = await pool.execute(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM posts p WHERE p.is_active = true';
    const countParams = [];

    if (category && category !== 'ALL') {
      countQuery += ' AND p.category = ?';
      countParams.push(category);
    }

    if (communityId) {
      countQuery += ' AND p.community_id = ?';
      countParams.push(communityId);
    }

    if (search) {
      countQuery += ' AND (p.title LIKE ? OR p.description LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      posts,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single post
const getPost = async (req, res) => {
  try {
    const { id } = req.params;

    const [posts] = await pool.execute(
      `SELECT p.*, u.full_name as author_name, u.profile_picture as author_picture,
              c.name as community_name, c.community_code
       FROM posts p
       JOIN users u ON p.user_id = u.id
       JOIN communities c ON p.community_id = c.id
       WHERE p.id = ? AND p.is_active = true`,
      [id]
    );

    if (posts.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Increment view count
    await pool.execute(
      'UPDATE posts SET view_count = view_count + 1 WHERE id = ?',
      [id]
    );

    res.json(posts[0]);

  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new post
const createPost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category, type, images, contactInfo } = req.body;
    const userId = req.user.id;
    const communityId = req.user.community_id;

    const [result] = await pool.execute(
      `INSERT INTO posts (title, description, category, type, contact_info, user_id, community_id, view_count, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, true, NOW(), NOW())`,
      [title, description, category, type, contactInfo, userId, communityId]
    );

    // Get created post
    const [posts] = await pool.execute(
      `SELECT p.*, u.full_name as author_name, u.profile_picture as author_picture,
              c.name as community_name, c.community_code
       FROM posts p
       JOIN users u ON p.user_id = u.id
       JOIN communities c ON p.community_id = c.id
       WHERE p.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      message: 'Post created successfully',
      post: posts[0]
    });

  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update post
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, type, images, contactInfo } = req.body;
    const userId = req.user.id;

    // Check if post exists and belongs to user
    const [posts] = await pool.execute(
      'SELECT * FROM posts WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (posts.length === 0) {
      return res.status(404).json({ error: 'Post not found or unauthorized' });
    }

    const [result] = await pool.execute(
      `UPDATE posts 
       SET title = ?, description = ?, category = ?, type = ?, images = ?, contact_info = ?, updated_at = NOW()
       WHERE id = ? AND user_id = ?`,
      [title, description, category, type, JSON.stringify(images || []), contactInfo, id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ error: 'Failed to update post' });
    }

    // Get updated post
    const [updatedPosts] = await pool.execute(
      `SELECT p.*, u.full_name as author_name, u.profile_picture as author_picture,
              c.name as community_name, c.community_code
       FROM posts p
       JOIN users u ON p.user_id = u.id
       JOIN communities c ON p.community_id = c.id
       WHERE p.id = ?`,
      [id]
    );

    res.json({
      message: 'Post updated successfully',
      post: updatedPosts[0]
    });

  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [result] = await pool.execute(
      'UPDATE posts SET is_active = false WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Post not found or unauthorized' });
    }

    res.json({ message: 'Post deleted successfully' });

  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user's posts
const getMyPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const [posts] = await pool.execute(
      `SELECT p.*, c.name as community_name, c.community_code
       FROM posts p
       JOIN communities c ON p.community_id = c.id
       WHERE p.user_id = ? AND p.is_active = true
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, parseInt(limit), offset]
    );

    // Get total count
    const [countResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM posts WHERE user_id = ? AND is_active = true',
      [userId]
    );

    const total = countResult[0].total;

    res.json({
      posts,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get my posts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Report a post
const reportPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, type } = req.body;
    const userId = req.user.id;

    // Check if post exists
    const [posts] = await pool.execute(
      'SELECT * FROM posts WHERE id = ? AND is_active = true',
      [id]
    );

    if (posts.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if user already reported this post
    const [existingReports] = await pool.execute(
      'SELECT * FROM reports WHERE post_id = ? AND user_id = ?',
      [id, userId]
    );

    if (existingReports.length > 0) {
      return res.status(400).json({ error: 'You have already reported this post' });
    }

    // Create report
    await pool.execute(
      `INSERT INTO reports (post_id, reporter_id, reason, type, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'PENDING', NOW(), NOW())`,
      [id, userId, reason, type]
    );

    res.json({ message: 'Post reported successfully' });

  } catch (error) {
    console.error('Report post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get post statistics
const getPostStats = async (req, res) => {
  try {
    const [stats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_posts,
        SUM(view_count) as total_views,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as posts_this_week,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as posts_this_month
      FROM posts 
      WHERE is_active = true
    `);

    res.json(stats[0]);

  } catch (error) {
    console.error('Get post stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getMyPosts,
  getPostStats,
  reportPost,
  createPostValidation
}; 