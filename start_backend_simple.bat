@echo off
echo ========================================
echo    Starting Tangle Backend
echo ========================================
echo.

cd backend
echo Compiling backend...
mvn clean compile
if %errorlevel% neq 0 (
    echo ERROR: Compilation failed
    pause
    exit /b 1
)

echo.
echo Starting backend...
mvn spring-boot:run

pause 