@echo off
echo ========================================
echo    Updating Passwords to "abcd"
echo ========================================
echo.

echo Step 1: Updating all user passwords to "abcd"...
mysql -u root -p < update_passwords.sql
if %errorlevel% neq 0 (
    echo ERROR: Password update failed
    echo Please check your MySQL connection
    pause
    exit /b 1
)
echo ✓ Passwords updated successfully

echo.
echo Step 2: Verifying the update...
mysql -u tangle_user -p -e "USE tangle_db; SELECT email, full_name, role FROM users;"
if %errorlevel% neq 0 (
    echo WARNING: Could not verify users
    echo You can manually check with: mysql -u tangle_user -p
)

echo.
echo ========================================
echo    Password Update Complete!
echo ========================================
echo.
echo All users now have password: abcd
echo.
echo Test credentials:
echo Email: john@example.com
echo Password: abcd
echo.
echo Email: demo@tangle.com  
echo Password: abcd
echo.
echo Press any key to exit...
pause >nul 