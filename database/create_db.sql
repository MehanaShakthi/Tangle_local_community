-- Create Database and User for Tangle Community App
-- Run this script as MySQL root user

-- Create the database
CREATE DATABASE IF NOT EXISTS tangle_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Create dedicated user for the application
CREATE USER IF NOT EXISTS 'tangle_user'@'localhost' 
IDENTIFIED BY 'tangle_password_2024';

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON tangle_db.* TO 'tangle_user'@'localhost';

-- Grant additional privileges for development
GRANT CREATE, DROP, ALTER, INDEX, REFERENCES ON tangle_db.* TO 'tangle_user'@'localhost';

-- Flush privileges to apply changes
FLUSH PRIVILEGES;

-- Switch to the database
USE tangle_db;

-- Display confirmation
SELECT 'Database tangle_db created successfully!' AS message;
SELECT 'User tangle_user created with all privileges' AS message;
SELECT 'You can now run: mysql -u tangle_user -p tangle_db < setup.sql' AS next_step; 