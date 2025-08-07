const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getCommunities,
  getCommunity,
  createCommunity,
  updateCommunity,
  deleteCommunity,
  searchCommunities,
  getCommunityByCode,
  createCommunityValidation
} = require('../controllers/communityController');

// Public routes
router.get('/', getCommunities);
router.get('/search', searchCommunities);
router.get('/code/:code', getCommunityByCode);
router.get('/:id', getCommunity);

// Protected routes
router.post('/', authenticateToken, createCommunityValidation, createCommunity);
router.put('/:id', authenticateToken, updateCommunity);
router.delete('/:id', authenticateToken, deleteCommunity);

module.exports = router; 