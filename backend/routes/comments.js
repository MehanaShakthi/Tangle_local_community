const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  createCommentValidation
} = require('../controllers/commentController');

// Public routes
router.get('/:postId', getComments);

// Protected routes
router.post('/:postId', authenticateToken, createCommentValidation, createComment);
router.put('/:id', authenticateToken, updateComment);
router.delete('/:id', authenticateToken, deleteComment);

module.exports = router; 