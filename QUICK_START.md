# 🧱 Tangle Community App - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Start the Backend
```bash
cd backend
mvn spring-boot:run
```
**Expected output:** Spring Boot should start on port 8080

### 2. Start the Frontend
```bash
cd frontend
npm start
```
**Expected output:** React should start on port 3000

### 3. Test the Login
Open `debug_login.html` in your browser to test the API directly.

## 🔧 Troubleshooting Login Issues

### If you're "still not logged in":

1. **Check if backend is running:**
   - Open http://localhost:8080/api/auth/login in browser
   - Should show a JSON error (not a 404)

2. **Check if database is set up:**
   ```sql
   mysql -u tangle_user -ptangle_password_2024 tangle_db
   SELECT * FROM users WHERE email = 'demo@tangle.com';
   ```

3. **Test the API directly:**
   - Open `debug_login.html` in your browser
   - Click "Test Login" with demo credentials
   - Check browser console for detailed errors

4. **Common Issues & Solutions:**

   **Issue:** "Connection refused" or "Network error"
   - **Solution:** Backend not running. Start with `mvn spring-boot:run`

   **Issue:** "Invalid credentials"
   - **Solution:** Database not set up. Run the setup scripts:
     ```bash
     mysql -u root -p < database/create_db.sql
     mysql -u tangle_user -ptangle_password_2024 tangle_db < database/setup.sql
     ```

   **Issue:** "CORS error"
   - **Solution:** Backend CORS is configured correctly. Check if backend is on port 8080

   **Issue:** "404 Not Found"
   - **Solution:** Check if backend context path is `/api` in `application.yml`

## 📝 Demo Credentials

- **Email:** demo@tangle.com
- **Password:** demo123
- **Community Code:** DEMO001

## 🔍 Debug Steps

1. **Backend Logs:** Check the console where you ran `mvn spring-boot:run`
2. **Frontend Logs:** Check browser console (F12)
3. **Network Tab:** Check the actual HTTP requests in browser dev tools
4. **Database:** Verify demo user exists in database

## 🛠 Manual Database Setup

If the automated setup doesn't work:

```sql
-- Connect as root
mysql -u root -p

-- Create database and user
CREATE DATABASE tangle_db;
CREATE USER 'tangle_user'@'localhost' IDENTIFIED BY 'tangle_password_2024';
GRANT ALL PRIVILEGES ON tangle_db.* TO 'tangle_user'@'localhost';
FLUSH PRIVILEGES;

-- Load schema and data
mysql -u tangle_user -ptangle_password_2024 tangle_db < database/setup.sql
```

## 📞 Need Help?

1. Check the backend console for error messages
2. Use the debug page (`debug_login.html`) to test API directly
3. Verify database connection in `application.yml`
4. Make sure MySQL is running and accessible

## 🎯 Expected Flow

1. Backend starts on port 8080
2. Frontend starts on port 3000
3. User visits http://localhost:3000
4. User clicks "Login" and enters demo credentials
5. User should be redirected to dashboard

If any step fails, check the corresponding logs and use the debug tools provided. 