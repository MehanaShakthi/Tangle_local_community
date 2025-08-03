-- Update all user passwords to "abcd"
USE tangle_db;

-- Update all existing users to have password "abcd" (BCrypt encoded)
UPDATE users SET password = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE email IN (
    'admin@tangle.com',
    'john@example.com', 
    'jane@example.com',
    'mike@example.com',
    'sarah@example.com',
    'demo@tangle.com'
);

-- Verify the password update
SELECT email, full_name, role FROM users;

-- Show success message
SELECT 'All passwords updated to "abcd" successfully!' as message; 