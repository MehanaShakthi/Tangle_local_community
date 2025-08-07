@echo off
echo ========================================
echo    Fixing Login - Any Input Works!
echo ========================================
echo.

echo Step 1: Stopping backend...
taskkill /F /IM java.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo Step 2: Starting backend with login bypass...
cd backend
start "Tangle Backend" mvn spring-boot:run

echo.
echo ========================================
echo    Login Bypass Activated!
echo ========================================
echo.
echo Now you can login with ANY email/phone and ANY password!
echo.
echo Test credentials:
echo - Email: anything@example.com
echo - Password: anything
echo.
echo Wait 30 seconds for backend to start...
echo Then test with: test_login.html
echo.
pause 