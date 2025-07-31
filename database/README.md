# Database Setup Guide for Tangle Community App

## 🗄️ Database Setup Instructions

### Prerequisites
- MySQL 8.0 or higher installed
- MySQL server running
- MySQL command line client or MySQL Workbench

### Step 1: Install MySQL (if not already installed)

#### Windows:
1. Download MySQL Installer from: https://dev.mysql.com/downloads/installer/
2. Run the installer and follow the setup wizard
3. Choose "Developer Default" or "Server only" installation
4. Set root password when prompted
5. Complete the installation

#### macOS:
```bash
# Using Homebrew
brew install mysql
brew services start mysql

# Or download from: https://dev.mysql.com/downloads/mysql/
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

### Step 2: Create Database and User

1. **Connect to MySQL as root:**
```bash
mysql -u root -p
```

2. **Create the database:**
```sql
CREATE DATABASE tangle_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. **Create a dedicated user (recommended):**
```sql
CREATE USER 'tangle_user'@'localhost' IDENTIFIED BY 'tangle_password_2024';
GRANT ALL PRIVILEGES ON tangle_db.* TO 'tangle_user'@'localhost';
FLUSH PRIVILEGES;
```

4. **Verify the setup:**
```sql
SHOW DATABASES;
USE tangle_db;
SHOW TABLES;
```

### Step 3: Run the Setup Script

1. **Navigate to the database directory:**
```bash
cd database
```

2. **Run the setup script:**
```bash
mysql -u tangle_user -p tangle_db < setup.sql
```

Or if using root:
```bash
mysql -u root -p tangle_db < setup.sql
```

### Step 4: Verify Database Setup

1. **Connect to the database:**
```bash
mysql -u tangle_user -p tangle_db
```

2. **Check tables:**
```sql
SHOW TABLES;
```

You should see:
- `communities`
- `users`
- `posts`
- `comments`
- `reports`

3. **Check sample data:**
```sql
SELECT * FROM communities;
SELECT * FROM users;
SELECT * FROM posts;
```

### Step 5: Configure Application Properties

Update your `backend/src/main/resources/application.yml` with your database credentials:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/tangle_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    username: tangle_user
    password: tangle_password_2024
```

### Step 6: Test Database Connection

1. **Start the Spring Boot application:**
```bash
cd backend
mvn spring-boot:run
```

2. **Check application logs** for database connection success

3. **Test API endpoints:**
```bash
# Test registration
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "communityCode": "DEMO001",
    "userRole": "RESIDENT"
  }'
```

## 🔧 Troubleshooting

### Common Issues:

1. **Connection Refused:**
   - Ensure MySQL service is running
   - Check if MySQL is listening on port 3306

2. **Access Denied:**
   - Verify username and password
   - Check user privileges
   - Try connecting as root first

3. **Database Not Found:**
   - Ensure database name is correct
   - Check if database was created successfully

4. **Character Set Issues:**
   - Ensure database uses utf8mb4 character set
   - Check table collation

### Useful MySQL Commands:

```sql
-- Show all databases
SHOW DATABASES;

-- Show all users
SELECT User, Host FROM mysql.user;

-- Show user privileges
SHOW GRANTS FOR 'tangle_user'@'localhost';

-- Check database character set
SELECT DEFAULT_CHARACTER_SET_NAME, DEFAULT_COLLATION_NAME 
FROM INFORMATION_SCHEMA.SCHEMATA 
WHERE SCHEMA_NAME = 'tangle_db';

-- Reset user password if needed
ALTER USER 'tangle_user'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

## 📊 Database Schema Overview

### Tables Structure:

1. **communities** - Community information
2. **users** - User accounts and profiles
3. **posts** - Community posts and announcements
4. **comments** - Comments on posts
5. **reports** - User reports and moderation

### Sample Data Included:
- Demo community (DEMO001)
- Test users with different roles
- Sample posts in various categories
- Comments and interactions

## 🚀 Quick Start Commands

```bash
# 1. Start MySQL (if not running)
sudo systemctl start mysql  # Linux
brew services start mysql   # macOS

# 2. Create database and user
mysql -u root -p < database/create_db.sql

# 3. Load schema and sample data
mysql -u tangle_user -p tangle_db < database/setup.sql

# 4. Start backend
cd backend && mvn spring-boot:run

# 5. Start frontend
cd frontend && npm start
```

## 🔐 Security Notes

1. **Change default passwords** in production
2. **Use strong passwords** for database users
3. **Limit database user privileges** to only necessary operations
4. **Enable SSL** for database connections in production
5. **Regular backups** of your database

## 📝 Next Steps

After database setup:
1. Start the Spring Boot backend
2. Start the React frontend
3. Test registration and login
4. Create your first community post
5. Explore all features

For more help, check the main `docs/setup_guide.md` file. 