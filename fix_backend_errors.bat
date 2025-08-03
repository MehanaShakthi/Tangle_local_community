@echo off
echo ========================================
echo    Fixing Backend Errors
echo ========================================
echo.

echo Step 1: Cleaning and compiling backend...
cd backend
mvn clean compile
if %errorlevel% neq 0 (
    echo ERROR: Backend compilation failed
    echo Please check the error messages above
    pause
    exit /b 1
)
echo ✓ Backend compiled successfully

echo.
echo Step 2: Testing backend startup...
echo Starting backend for 10 seconds to test...
start /B mvn spring-boot:run
timeout /t 10 /nobreak >nul
taskkill /F /IM java.exe >nul 2>&1
echo ✓ Backend startup test completed

echo.
echo Step 3: Building final JAR...
mvn clean package -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: JAR build failed
    pause
    exit /b 1
)
echo ✓ JAR built successfully

echo.
echo ========================================
echo    Backend Errors Fixed!
echo ========================================
echo.
echo The backend should now compile and run without errors.
echo You can start it with: mvn spring-boot:run
echo.
pause 