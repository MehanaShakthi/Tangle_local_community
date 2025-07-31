@echo off
REM Tangle Community App - Complete Setup Script for Windows
REM This script will set up the entire application including database, backend, and frontend

echo.
echo 🧱 Tangle Community App - Complete Setup
echo ========================================
echo.

REM Check if MySQL is installed
echo [INFO] Checking MySQL installation...
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] MySQL is not installed. Please install MySQL first.
    echo Visit: https://dev.mysql.com/downloads/installer/
    pause
    exit /b 1
)
echo [SUCCESS] MySQL is installed

REM Setup database
echo.
echo [INFO] Setting up database...

REM Check if MySQL is running
mysqladmin ping -h localhost -u root --silent >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] MySQL is not running. Please start MySQL service first.
    echo On Windows: Start MySQL from Services
    pause
    exit /b 1
)

REM Create database and user
echo [INFO] Creating database and user...
mysql -u root -p < database\create_db.sql
if %errorlevel% neq 0 (
    echo [ERROR] Failed to create database
    pause
    exit /b 1
)
echo [SUCCESS] Database created successfully

REM Load schema and sample data
echo [INFO] Loading schema and sample data...
mysql -u tangle_user -ptangle_password_2024 tangle_db < database\setup.sql
if %errorlevel% neq 0 (
    echo [ERROR] Failed to load schema
    pause
    exit /b 1
)
echo [SUCCESS] Schema and sample data loaded successfully

REM Setup backend
echo.
echo [INFO] Setting up Spring Boot backend...

REM Check if Maven is installed
mvn --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Maven is not installed. Please install Maven first.
    echo Visit: https://maven.apache.org/download.cgi
    pause
    exit /b 1
)

REM Download dependencies
echo [INFO] Downloading Maven dependencies...
cd backend
mvn dependency:resolve
if %errorlevel% neq 0 (
    echo [ERROR] Failed to download dependencies
    cd ..
    pause
    exit /b 1
)
echo [SUCCESS] Dependencies downloaded successfully
cd ..

REM Setup frontend
echo.
echo [INFO] Setting up React frontend...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed. Please install npm first.
    pause
    exit /b 1
)

REM Install dependencies
echo [INFO] Installing npm dependencies...
cd frontend
npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)
echo [SUCCESS] Frontend dependencies installed successfully
cd ..

REM Test the application
echo.
echo [INFO] Testing application setup...

REM Test database connection
echo [INFO] Testing database connection...
mysql -u tangle_user -ptangle_password_2024 tangle_db -e "SELECT COUNT(*) FROM users;" >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Database connection failed
    pause
    exit /b 1
)
echo [SUCCESS] Database connection successful

REM Test backend compilation
echo [INFO] Testing backend compilation...
cd backend
mvn compile -q
if %errorlevel% neq 0 (
    echo [ERROR] Backend compilation failed
    cd ..
    pause
    exit /b 1
)
echo [SUCCESS] Backend compilation successful
cd ..

REM Test frontend build
echo [INFO] Testing frontend build...
cd frontend
npm run build >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Frontend build failed
    cd ..
    pause
    exit /b 1
)
echo [SUCCESS] Frontend build successful
cd ..

echo.
echo [SUCCESS] Setup completed successfully!
echo.
echo 🚀 To start the application, run these commands in separate terminals:
echo.
echo Terminal 1 - Backend:
echo   cd backend
echo   mvn spring-boot:run
echo.
echo Terminal 2 - Frontend:
echo   cd frontend
echo   npm start
echo.
echo 🌐 The application will be available at:
echo   Frontend: http://localhost:3000
echo   Backend API: http://localhost:8080/api
echo.
echo 📝 Demo Account:
echo   Email: demo@tangle.com
echo   Password: demo123
echo.
echo 🔑 Community Code: DEMO001
echo.
pause 