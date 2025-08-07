const { pool } = require('../config/database');
const { body, validationResult } = require('express-validator');

// Validation rules
const createCommunityValidation = [
  body('name').notEmpty().withMessage('Community name is required'),
  body('communityCode').notEmpty().withMessage('Community code is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('state').notEmpty().withMessage('State is required'),
  body('pincode').notEmpty().withMessage('Pincode is required')
];

// Get all communities
const getCommunities = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM communities WHERE is_active = true';
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR city LIKE ? OR location LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY name ASC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [communities] = await pool.execute(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM communities WHERE is_active = true';
    const countParams = [];

    if (search) {
      countQuery += ' AND (name LIKE ? OR city LIKE ? OR location LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      communities,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get communities error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single community
const getCommunity = async (req, res) => {
  try {
    const { id } = req.params;

    const [communities] = await pool.execute(
      'SELECT * FROM communities WHERE id = ? AND is_active = true',
      [id]
    );

    if (communities.length === 0) {
      return res.status(404).json({ error: 'Community not found' });
    }

    res.json(communities[0]);

  } catch (error) {
    console.error('Get community error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create community
const createCommunity = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, communityCode, location, city, state, pincode, description } = req.body;

    // Check if community code already exists
    const [existingCommunities] = await pool.execute(
      'SELECT * FROM communities WHERE community_code = ?',
      [communityCode]
    );

    if (existingCommunities.length > 0) {
      return res.status(400).json({ error: 'Community code already exists' });
    }

    const [result] = await pool.execute(
      `INSERT INTO communities (name, community_code, location, city, state, pincode, description, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, true, NOW(), NOW())`,
      [name, communityCode, location, city, state, pincode, description]
    );

    // Get created community
    const [communities] = await pool.execute(
      'SELECT * FROM communities WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Community created successfully',
      community: communities[0]
    });

  } catch (error) {
    console.error('Create community error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update community
const updateCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, city, state, pincode, description } = req.body;

    const [result] = await pool.execute(
      `UPDATE communities 
       SET name = ?, location = ?, city = ?, state = ?, pincode = ?, description = ?, updated_at = NOW()
       WHERE id = ?`,
      [name, location, city, state, pincode, description, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Community not found' });
    }

    // Get updated community
    const [communities] = await pool.execute(
      'SELECT * FROM communities WHERE id = ?',
      [id]
    );

    res.json({
      message: 'Community updated successfully',
      community: communities[0]
    });

  } catch (error) {
    console.error('Update community error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete community
const deleteCommunity = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'UPDATE communities SET is_active = false WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Community not found' });
    }

    res.json({ message: 'Community deleted successfully' });

  } catch (error) {
    console.error('Delete community error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Search communities
const searchCommunities = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const [communities] = await pool.execute(
      `SELECT * FROM communities 
       WHERE is_active = true 
       AND (name LIKE ? OR city LIKE ? OR location LIKE ? OR community_code LIKE ?)
       ORDER BY name ASC
       LIMIT 20`,
      [`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`]
    );

    res.json({ communities });

  } catch (error) {
    console.error('Search communities error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get community by code
const getCommunityByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const [communities] = await pool.execute(
      'SELECT * FROM communities WHERE community_code = ? AND is_active = true',
      [code]
    );

    if (communities.length === 0) {
      return res.status(404).json({ error: 'Community not found' });
    }

    res.json(communities[0]);

  } catch (error) {
    console.error('Get community by code error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getCommunities,
  getCommunity,
  createCommunity,
  updateCommunity,
  deleteCommunity,
  searchCommunities,
  getCommunityByCode,
  createCommunityValidation
}; 