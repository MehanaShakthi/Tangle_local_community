-- Tangle Community App Database Setup
-- MySQL Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS tangle_db;
USE tangle_db;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS communities;

-- Create communities table
CREATE TABLE communities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    pincode VARCHAR(10),
    city VARCHAR(100),
    state VARCHAR(100),
    community_code VARCHAR(50) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(20) UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('RESIDENT', 'BUSINESS_OWNER', 'SERVICE_PROVIDER', 'ADMIN', 'MODERATOR') DEFAULT 'RESIDENT',
    address TEXT,
    locality VARCHAR(100),
    pincode VARCHAR(10),
    community_id BIGINT,
    profile_picture VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (community_id) REFERENCES communities(id)
);

-- Create posts table
CREATE TABLE posts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('HELP_REQUEST', 'HELP_OFFER', 'BUY_SELL', 'BUSINESS', 'SERVICE', 'JOB_GIG', 'EVENT', 'ANNOUNCEMENT', 'LOST_FOUND', 'VOLUNTEER') NOT NULL,
    type ENUM('REQUEST', 'OFFER', 'ANNOUNCEMENT') NOT NULL,
    user_id BIGINT NOT NULL,
    community_id BIGINT NOT NULL,
    contact_info TEXT,
    price DECIMAL(10,2),
    location VARCHAR(255),
    images TEXT,
    is_urgent BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    view_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (community_id) REFERENCES communities(id)
);

-- Create comments table
CREATE TABLE comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    user_id BIGINT NOT NULL,
    post_id BIGINT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(id)
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
    admin_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_id) REFERENCES users(id),
    FOREIGN KEY (reported_user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(id)
);

-- Insert sample communities
INSERT INTO communities (name, description, location, pincode, city, state, community_code) VALUES
('Anna Nagar Community', 'A vibrant residential community in Anna Nagar', 'Anna Nagar', '600040', 'Chennai', 'Tamil Nadu', 'ANNA001'),
('Koramangala Residents', 'Tech hub community in Koramangala', 'Koramangala', '560034', 'Bangalore', 'Karnataka', 'KORAM001'),
('Andheri West Society', 'Peaceful society in Andheri West', 'Andheri West', '400058', 'Mumbai', 'Maharashtra', 'ANDHERI001'),
('Gurgaon Cyber City', 'Modern community near Cyber City', 'Cyber City', '122002', 'Gurgaon', 'Haryana', 'GURGAON001');

-- Insert sample users (password is 'demo123' encrypted with BCrypt)
INSERT INTO users (full_name, email, phone_number, password, role, address, locality, pincode, community_id, is_verified) VALUES
('Demo User', 'demo@tangle.com', '+919876543210', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'RESIDENT', '123 Main Street', 'Anna Nagar', '600040', 1, TRUE),
('John Smith', 'john@example.com', '+919876543211', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'BUSINESS_OWNER', '456 Business Ave', 'Anna Nagar', '600040', 1, TRUE),
('Sarah Johnson', 'sarah@example.com', '+919876543212', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'SERVICE_PROVIDER', '789 Service Road', 'Anna Nagar', '600040', 1, TRUE),
('Mike Wilson', 'mike@example.com', '+919876543213', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'RESIDENT', '321 Resident Lane', 'Koramangala', '560034', 2, TRUE);

-- Insert sample posts
INSERT INTO posts (title, description, category, type, user_id, community_id, contact_info, price, location, is_urgent) VALUES
('Need blood group A+ urgently', 'My father needs blood group A+ for surgery tomorrow. Please help if you can donate.', 'HELP_REQUEST', 'REQUEST', 1, 1, 'Contact: 9876543210', NULL, 'Anna Nagar Hospital', TRUE),
('Offering free tuition for kids', 'I am a qualified teacher offering free tuition for underprivileged children in our community.', 'HELP_OFFER', 'OFFER', 2, 1, 'Contact: 9876543211', NULL, 'Anna Nagar', FALSE),
('Selling old bicycle', 'Good condition bicycle for sale. Perfect for daily commute.', 'BUY_SELL', 'OFFER', 3, 1, 'Contact: 9876543212', 2000.00, 'Anna Nagar', FALSE),
('Home tiffin service available', 'Delicious homemade tiffin service available. Daily meals at reasonable rates.', 'BUSINESS', 'OFFER', 2, 1, 'Contact: 9876543211', 150.00, 'Anna Nagar', FALSE),
('Electrician services', 'Professional electrician available for all types of electrical work.', 'SERVICE', 'OFFER', 3, 1, 'Contact: 9876543212', NULL, 'Anna Nagar', FALSE),
('Community health camp', 'Free health checkup camp this Sunday at the community center.', 'EVENT', 'ANNOUNCEMENT', 1, 1, 'Contact: 9876543210', NULL, 'Community Center', FALSE),
('Lost pet dog', 'Lost my golden retriever named Max. Last seen near Anna Nagar park.', 'LOST_FOUND', 'REQUEST', 1, 1, 'Contact: 9876543210', NULL, 'Anna Nagar Park', TRUE),
('Volunteer for community cleanup', 'Looking for volunteers for community cleanup drive this weekend.', 'VOLUNTEER', 'REQUEST', 2, 1, 'Contact: 9876543211', NULL, 'Anna Nagar', FALSE);

-- Insert sample comments
INSERT INTO comments (content, user_id, post_id) VALUES
('I can help with blood donation. Will contact you.', 2, 1),
('Great initiative! I will join the cleanup drive.', 3, 8),
('The tiffin service is excellent. Highly recommended!', 1, 4),
('I have seen a similar dog near the market. Will keep an eye out.', 2, 7);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_community ON users(community_id);
CREATE INDEX idx_posts_community ON posts(community_id);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_user ON posts(user_id);
CREATE INDEX idx_posts_created ON posts(created_at);
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_reports_status ON reports(status);

-- Create views for common queries
CREATE VIEW active_posts AS
SELECT p.*, u.full_name as user_name, c.name as community_name
FROM posts p
JOIN users u ON p.user_id = u.id
JOIN communities c ON p.community_id = c.id
WHERE p.is_active = TRUE AND u.is_active = TRUE;

CREATE VIEW community_stats AS
SELECT 
    c.id as community_id,
    c.name as community_name,
    COUNT(DISTINCT u.id) as member_count,
    COUNT(DISTINCT p.id) as post_count,
    COUNT(DISTINCT CASE WHEN p.is_urgent = TRUE THEN p.id END) as urgent_count
FROM communities c
LEFT JOIN users u ON c.id = u.community_id AND u.is_active = TRUE
LEFT JOIN posts p ON c.id = p.community_id AND p.is_active = TRUE
GROUP BY c.id, c.name;

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON tangle_db.* TO 'tangle_user'@'localhost';
-- FLUSH PRIVILEGES;

-- Show created tables
SHOW TABLES;

-- Show sample data
SELECT 'Communities' as table_name, COUNT(*) as count FROM communities
UNION ALL
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Posts' as table_name, COUNT(*) as count FROM posts
UNION ALL
SELECT 'Comments' as table_name, COUNT(*) as count FROM comments; 