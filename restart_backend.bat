@echo off
echo ========================================
echo    Restarting Tangle Backend
echo ========================================
echo.

echo Step 1: Stopping existing backend...
taskkill /F /IM java.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo Step 2: Compiling backend...
cd backend
mvn clean compile
if %errorlevel% neq 0 (
    echo ERROR: Compilation failed
    pause
    exit /b 1
)

echo Step 3: Starting backend...
start "Tangle Backend" mvn spring-boot:run

echo.
echo ========================================
echo    Backend Restarted!
echo ========================================
echo.
echo Wait 30 seconds for backend to start...
echo Then test with: http://localhost:8080/api/test
echo.
pause 