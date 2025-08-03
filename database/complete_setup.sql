-- Complete Database Setup for Tangle Community App
-- This script creates the database, user, and all necessary tables

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS tangle_db;
USE tangle_db;

-- Create user if not exists
CREATE USER IF NOT EXISTS 'tangle_user'@'localhost' IDENTIFIED BY 'tangle_password_2024';
GRANT ALL PRIVILEGES ON tangle_db.* TO 'tangle_user'@'localhost';
FLUSH PRIVILEGES;

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS communities;

-- Create communities table
CREATE TABLE communities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    pincode VARCHAR(10),
    city VARCHAR(100),
    state VARCHAR(100),
    community_code VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(20) UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('RESIDENT', 'BUSINESS_OWNER', 'SERVICE_PROVIDER', 'ADMIN', 'MODERATOR') DEFAULT 'RESIDENT',
    address TEXT,
    locality VARCHAR(255),
    pincode VARCHAR(10),
    profile_picture VARCHAR(500),
    community_id BIGINT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE SET NULL,
    INDEX idx_email (email),
    INDEX idx_phone (phone_number),
    INDEX idx_community (community_id),
    INDEX idx_role (role)
);

-- Create posts table
CREATE TABLE posts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('HELP_REQUEST', 'HELP_OFFER', 'BUY_SELL', 'BUSINESS', 'SERVICE', 'JOB_GIG', 'EVENT', 'ANNOUNCEMENT', 'LOST_FOUND', 'VOLUNTEER') NOT NULL,
    type ENUM('REQUEST', 'OFFER', 'ANNOUNCEMENT') NOT NULL,
    user_id BIGINT NOT NULL,
    community_id BIGINT NOT NULL,
    contact_info VARCHAR(255),
    price DECIMAL(10,2),
    location VARCHAR(255),
    images JSON,
    is_urgent BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    view_count BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_community (community_id),
    INDEX idx_category (category),
    INDEX idx_type (type),
    INDEX idx_urgent (is_urgent),
    INDEX idx_featured (is_featured),
    INDEX idx_active (is_active),
    INDEX idx_created (created_at)
);

-- Create comments table
CREATE TABLE comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    user_id BIGINT NOT NULL,
    post_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_post (post_id),
    INDEX idx_created (created_at)
);

-- Create reports table
CREATE TABLE reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reason TEXT NOT NULL,
    type ENUM('SPAM', 'INAPPROPRIATE_CONTENT', 'FAKE_INFORMATION', 'HARASSMENT', 'SCAM', 'OTHER') NOT NULL,
    reporter_id BIGINT NOT NULL,
    reported_user_id BIGINT,
    post_id BIGINT,
    status ENUM('PENDING', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reported_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    INDEX idx_reporter (reporter_id),
    INDEX idx_reported_user (reported_user_id),
    INDEX idx_post (post_id),
    INDEX idx_status (status),
    INDEX idx_type (type)
);

-- Insert sample communities
INSERT INTO communities (name, description, location, pincode, city, state, community_code) VALUES
('Anna Nagar Community', 'A vibrant residential community in Anna Nagar', 'Anna Nagar', '600040', 'Chennai', 'Tamil Nadu', 'ANNA001'),
('T Nagar Residents', 'Commercial and residential area in T Nagar', 'T Nagar', '600017', 'Chennai', 'Tamil Nadu', 'TNAGAR001'),
('Adyar Community', 'Peaceful community near Adyar Bridge', 'Adyar', '600020', 'Chennai', 'Tamil Nadu', 'ADYAR001'),
('Mylapore Heritage', 'Traditional community in Mylapore', 'Mylapore', '600004', 'Chennai', 'Tamil Nadu', 'MYLAPORE001'),
('Velachery Residents', 'Modern residential community in Velachery', 'Velachery', '600042', 'Chennai', 'Tamil Nadu', 'VELACHERY001');

-- Insert sample users (password is 'abcd' encoded with BCrypt)
INSERT INTO users (full_name, email, phone_number, password, role, address, locality, pincode, community_id, is_verified, is_active) VALUES
('Admin User', 'admin@tangle.com', '9876543210', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN', '123 Admin Street', 'Anna Nagar', '600040', 1, TRUE, TRUE),
('John Doe', 'john@example.com', '9876543211', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'RESIDENT', '456 Main Road', 'Anna Nagar', '600040', 1, TRUE, TRUE),
('Jane Smith', 'jane@example.com', '9876543212', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'BUSINESS_OWNER', '789 Business Ave', 'T Nagar', '600017', 2, TRUE, TRUE),
('Mike Johnson', 'mike@example.com', '9876543213', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'SERVICE_PROVIDER', '321 Service Lane', 'Adyar', '600020', 3, TRUE, TRUE),
('Sarah Wilson', 'sarah@example.com', '9876543214', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'RESIDENT', '654 Resident Street', 'Mylapore', '600004', 4, TRUE, TRUE);

-- Insert sample posts
INSERT INTO posts (title, description, category, type, user_id, community_id, contact_info, price, location, is_urgent, is_featured) VALUES
('Need help with laptop repair', 'My laptop is not starting. Looking for someone who can help fix it.', 'HELP_REQUEST', 'REQUEST', 2, 1, '9876543211', NULL, 'Anna Nagar', FALSE, FALSE),
('Offering free tuition for kids', 'I can help with mathematics and science for school children.', 'HELP_OFFER', 'OFFER', 3, 2, '9876543212', NULL, 'T Nagar', FALSE, TRUE),
('Selling old bicycle', 'Good condition bicycle for sale. Perfect for daily commute.', 'BUY_SELL', 'OFFER', 4, 3, '9876543213', 2000.00, 'Adyar', FALSE, FALSE),
('Home tiffin service', 'Delicious home-cooked meals delivered to your doorstep.', 'BUSINESS', 'OFFER', 5, 4, '9876543214', 150.00, 'Mylapore', FALSE, TRUE),
('Lost dog - Golden Retriever', 'Lost my golden retriever near Anna Nagar park. Please help find.', 'LOST_FOUND', 'REQUEST', 2, 1, '9876543211', NULL, 'Anna Nagar', TRUE, FALSE),
('Electrician needed urgently', 'Need an electrician for immediate repair work.', 'SERVICE', 'REQUEST', 3, 2, '9876543212', NULL, 'T Nagar', TRUE, FALSE),
('Community health camp', 'Free health checkup camp this weekend at community hall.', 'EVENT', 'ANNOUNCEMENT', 1, 1, '9876543210', NULL, 'Anna Nagar', FALSE, TRUE),
('Volunteer for blood donation', 'Urgent need for blood donors. Please come forward to help.', 'VOLUNTEER', 'REQUEST', 4, 3, '9876543213', NULL, 'Adyar', TRUE, TRUE);

-- Insert sample comments
INSERT INTO comments (content, user_id, post_id) VALUES
('I can help you with laptop repair. What brand is it?', 3, 1),
('Thank you for offering free tuition. My son needs help with math.', 2, 2),
('Is the bicycle still available? What size is it?', 5, 3),
('Great tiffin service! Highly recommended.', 2, 4),
('I saw a golden retriever near the park yesterday. Will keep an eye out.', 3, 5),
('I am a certified electrician. Can help you immediately.', 4, 6),
('Great initiative! Will definitely attend the health camp.', 5, 7),
('I am ready to donate blood. When and where?', 2, 8);

-- Create views for better performance
CREATE VIEW post_stats AS
SELECT 
    p.id,
    p.title,
    p.view_count,
    COUNT(c.id) as comment_count,
    p.created_at
FROM posts p
LEFT JOIN comments c ON p.id = c.post_id
WHERE p.is_active = TRUE
GROUP BY p.id;

CREATE VIEW user_stats AS
SELECT 
    u.id,
    u.full_name,
    COUNT(p.id) as total_posts,
    SUM(p.view_count) as total_views,
    COUNT(c.id) as total_comments
FROM users u
LEFT JOIN posts p ON u.id = p.user_id AND p.is_active = TRUE
LEFT JOIN comments c ON u.id = c.user_id
WHERE u.is_active = TRUE
GROUP BY u.id;

-- Show success message
SELECT 'Database setup completed successfully!' as status; 