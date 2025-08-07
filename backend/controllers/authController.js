const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
const { generateToken } = require('../utils/jwt');
const { body, validationResult } = require('express-validator');

// Validation rules
const registerValidation = [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('address').notEmpty().withMessage('Address is required'),
  body('locality').notEmpty().withMessage('Locality is required'),
  body('pincode').notEmpty().withMessage('Pincode is required'),
  body('role').isIn(['RESIDENT', 'BUSINESS_OWNER', 'SERVICE_PROVIDER', 'ADMIN']).withMessage('Invalid role'),
  body('communityCode').notEmpty().withMessage('Community code is required')
];

const loginValidation = [
  body('emailOrPhone').notEmpty().withMessage('Email or phone is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Register user
const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      fullName,
      email,
      phoneNumber,
      password,
      address,
      locality,
      pincode,
      role,
      communityCode
    } = req.body;

    // Check if user already exists
    const [existingUsers] = await pool.execute(
      'SELECT * FROM users WHERE email = ? OR phone_number = ?',
      [email, phoneNumber]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User with this email or phone number already exists' });
    }

    // Check if community exists by code
    const [communities] = await pool.execute(
      'SELECT * FROM communities WHERE community_code = ?',
      [communityCode]
    );

    if (communities.length === 0) {
      return res.status(400).json({ error: 'Community not found with the provided code' });
    }

    const communityId = communities[0].id;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const [result] = await pool.execute(
      `INSERT INTO users (full_name, email, phone_number, password, address, locality, pincode, role, community_id, is_active, is_verified, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, true, true, NOW(), NOW())`,
      [fullName, email, phoneNumber, hashedPassword, address, locality, pincode, role, communityId]
    );

    // Get created user
    const [users] = await pool.execute(
      `SELECT u.*, c.name as community_name, c.community_code, c.location, c.city, c.state, c.pincode as community_pincode
       FROM users u 
       JOIN communities c ON u.community_id = c.id 
       WHERE u.id = ?`,
      [result.insertId]
    );

    const user = users[0];

    // Generate token
    const token = generateToken(user.id);

    // Remove password from response
    delete user.password;

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { emailOrPhone, password } = req.body;

    // Find user by email or phone
    const [users] = await pool.execute(
      `SELECT u.*, c.name as community_name, c.community_code, c.location, c.city, c.state, c.pincode as community_pincode
       FROM users u 
       JOIN communities c ON u.community_id = c.id 
       WHERE u.email = ? OR u.phone_number = ?`,
      [emailOrPhone, emailOrPhone]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id);

    // Remove password from response
    delete user.password;

    res.json({
      message: 'Login successful',
      token,
      user
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const [users] = await pool.execute(
      `SELECT u.*, c.name as community_name, c.community_code, c.location, c.city, c.state, c.pincode as community_pincode
       FROM users u 
       JOIN communities c ON u.community_id = c.id 
       WHERE u.id = ?`,
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];
    delete user.password;

    res.json(user);

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user stats
const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's post count
    const [postCount] = await pool.execute(
      'SELECT COUNT(*) as count FROM posts WHERE user_id = ? AND is_active = true',
      [userId]
    );

    // Get user's comment count
    const [commentCount] = await pool.execute(
      'SELECT COUNT(*) as count FROM comments WHERE user_id = ? AND is_active = true',
      [userId]
    );

    // Get user's total post views
    const [viewCount] = await pool.execute(
      'SELECT SUM(view_count) as total FROM posts WHERE user_id = ? AND is_active = true',
      [userId]
    );

    // Get user's total post likes (placeholder - likes feature not implemented yet)
    const likeCount = [{ total: 0 }];

    res.json({
      posts: postCount[0].count,
      comments: commentCount[0].count,
      totalViews: viewCount[0].total || 0,
      totalLikes: likeCount[0].total || 0
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { fullName, address, locality, pincode, profilePicture } = req.body;

    const [result] = await pool.execute(
      `UPDATE users 
       SET full_name = ?, address = ?, locality = ?, pincode = ?, profile_picture = ?, updated_at = NOW()
       WHERE id = ?`,
      [fullName, address, locality, pincode, profilePicture, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get updated user
    const [users] = await pool.execute(
      `SELECT u.*, c.name as community_name, c.community_code, c.location, c.city, c.state, c.pincode as community_pincode
       FROM users u 
       JOIN communities c ON u.community_id = c.id 
       WHERE u.id = ?`,
      [req.user.id]
    );

    const user = users[0];
    delete user.password;

    res.json({
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  getUserStats,
  registerValidation,
  loginValidation
}; 