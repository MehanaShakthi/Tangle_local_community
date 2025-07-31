# 🧱 Tangle Community App - Windows Setup Guide

## 🚀 Quick Start (Windows)

### Step 1: Database Setup ✅ (Already Done)
The database is already set up with:
- Database: `tangle_db`
- User: `tangle_user`
- Password: `tangle_password_2024`
- Demo user: `demo@tangle.com` / `demo123`

### Step 2: Start Backend
**Option A: Using the batch file (Recommended)**
```cmd
start_backend.bat
```

**Option B: Manual commands**
```cmd
cd backend
mvn spring-boot:run
```

**Expected output:** You should see Spring Boot starting with messages like:
```
Started TangleApplication in X.XXX seconds
```

### Step 3: Start Frontend
**Option A: Using the batch file (Recommended)**
```cmd
start_frontend.bat
```

**Option B: Manual commands**
```cmd
cd frontend
npm start
```

**Expected output:** React should start and open http://localhost:3000

### Step 4: Test Login
1. Open http://localhost:3000
2. Click "Login"
3. Use demo credentials:
   - **Email:** demo@tangle.com
   - **Password:** demo123

## 🔧 Troubleshooting

### If backend won't start:
1. **Check if Java is installed:**
   ```cmd
   java -version
   ```

2. **Check if Maven is installed:**
   ```cmd
   mvn -version
   ```

3. **Check if MySQL is running:**
   ```cmd
   mysql -u tangle_user -ptangle_password_2024 tangle_db -e "SELECT 1;"
   ```

### If frontend won't start:
1. **Check if Node.js is installed:**
   ```cmd
   node --version
   npm --version
   ```

2. **Install dependencies:**
   ```cmd
   cd frontend
   npm install
   ```

### If login fails:
1. **Test the API directly:**
   - Open `debug_login.html` in your browser
   - Click "Test Login"

2. **Check backend logs:**
   - Look at the console where you ran `start_backend.bat`
   - Look for error messages

## 📝 Common Windows Issues

### Issue: "mvn is not recognized"
**Solution:** Install Maven or add it to PATH

### Issue: "npm is not recognized"
**Solution:** Install Node.js from https://nodejs.org/

### Issue: "mysql is not recognized"
**Solution:** Add MySQL to PATH or use full path:
```cmd
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u tangle_user -ptangle_password_2024 tangle_db
```

### Issue: "Port 8080 is already in use"
**Solution:** Kill the process or change port in `backend/src/main/resources/application.yml`

## 🎯 Expected Flow

1. **Backend starts** → You see Spring Boot startup messages
2. **Frontend starts** → Browser opens to http://localhost:3000
3. **User logs in** → Enters demo credentials
4. **Dashboard loads** → User sees the community dashboard

## 🆘 Need Help?

1. **Check if services are running:**
   - Backend: http://localhost:8080/api/auth/login
   - Frontend: http://localhost:3000

2. **Use the debug page:**
   - Open `debug_login.html` to test API directly

3. **Check logs:**
   - Backend logs in the console where you ran `start_backend.bat`
   - Frontend logs in the browser console (F12)

## 📞 Quick Commands

```cmd
# Start everything
start_backend.bat
start_frontend.bat

# Test database
mysql -u tangle_user -ptangle_password_2024 tangle_db -e "SELECT * FROM users;"

# Test API
curl http://localhost:8080/api/auth/login
``` 