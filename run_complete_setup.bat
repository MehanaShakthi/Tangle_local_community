@echo off
echo ========================================
echo    Tangle Community App Setup
echo ========================================
echo.

echo Step 1: Checking prerequisites...
echo.

REM Check Java
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java 17 or higher
    pause
    exit /b 1
)
echo ✓ Java is installed

REM Check Maven
mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Maven is not installed or not in PATH
    echo Please install Apache Maven
    pause
    exit /b 1
)
echo ✓ Maven is installed

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 16 or higher
    pause
    exit /b 1
)
echo ✓ Node.js is installed

REM Check MySQL
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: MySQL is not installed or not in PATH
    echo Please install MySQL 8.0
    pause
    exit /b 1
)
echo ✓ MySQL is installed

echo.
echo Step 2: Starting MySQL service...
net start mysql80 >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Could not start MySQL service. Please start it manually.
    echo Run: net start mysql80
    pause
)

echo.
echo Step 3: Setting up database...
echo Please enter your MySQL root password when prompted:
mysql -u root -p < database/complete_setup.sql
if %errorlevel% neq 0 (
    echo ERROR: Database setup failed
    pause
    exit /b 1
)
echo ✓ Database setup completed

echo.
echo Step 4: Building and starting backend...
cd backend
echo Building backend...
mvn clean install -q
if %errorlevel% neq 0 (
    echo ERROR: Backend build failed
    pause
    exit /b 1
)
echo ✓ Backend built successfully

echo Starting backend...
start "Tangle Backend" cmd /k "mvn spring-boot:run"

echo.
echo Step 5: Setting up frontend...
cd ..\frontend
echo Installing frontend dependencies...
npm install --silent
if %errorlevel% neq 0 (
    echo ERROR: Frontend dependency installation failed
    pause
    exit /b 1
)
echo ✓ Frontend dependencies installed

echo Starting frontend...
start "Tangle Frontend" cmd /k "npm start"

echo.
echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo Backend: http://localhost:8080/api
echo Frontend: http://localhost:3000
echo.
echo Test credentials:
echo Email: john@example.com
echo Password: password123
echo.
echo Press any key to exit...
pause >nul 