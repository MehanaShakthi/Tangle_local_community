const express = require('express');
const router = express.Router();
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getMyPosts,
  getPostStats,
  reportPost,
  createPostValidation
} = require('../controllers/postController');

// Public routes (with optional auth for user-specific features)
router.get('/', optionalAuth, getPosts);
router.get('/stats', getPostStats);
router.get('/:id', optionalAuth, getPost);

// Protected routes
router.post('/', authenticateToken, createPostValidation, createPost);
router.put('/:id', authenticateToken, updatePost);
router.delete('/:id', authenticateToken, deletePost);
router.post('/:id/report', authenticateToken, reportPost);
router.get('/my-posts', authenticateToken, getMyPosts);

module.exports = router; 