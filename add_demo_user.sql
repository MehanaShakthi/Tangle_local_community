-- Add demo user for testing
USE tangle_db;

-- Insert demo user (password is 'abcd' encoded with BCrypt)
INSERT INTO users (full_name, email, phone_number, password, role, address, locality, pincode, community_id, is_verified, is_active) VALUES
('Demo User', 'demo@tangle.com', '9876543215', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'RESIDENT', '123 Demo Street', 'Demo Area', '600000', 1, TRUE, TRUE);

-- Verify the user was created
SELECT email, full_name, role FROM users WHERE email = 'demo@tangle.com'; 