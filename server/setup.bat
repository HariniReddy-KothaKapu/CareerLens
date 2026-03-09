@echo off
echo ========================================
echo CareerLens Oracle Database Setup
echo ========================================
echo.

REM Check if SQL*Plus is installed
where sqlplus >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: SQL*Plus is not found in PATH
    echo Please install Oracle Database or add SQL*Plus to PATH
    pause
    exit /b 1
)

echo SQL*Plus found!
echo.

REM Prompt for Oracle credentials
set /p DB_USER="Enter Oracle username (default: system): " || set DB_USER=system
set /p DB_PASSWORD="Enter Oracle password: "
set /p DB_CONNECTION="Enter connection string (default: localhost:1521/XEPDB1): " || set DB_CONNECTION=localhost:1521/XEPDB1

echo.
echo Testing Oracle connection...
echo exit | sqlplus -S %DB_USER%/%DB_PASSWORD%@%DB_CONNECTION% >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Cannot connect to Oracle Database
    echo Please check your credentials and connection string
    pause
    exit /b 1
)

echo Connection successful!
echo.

REM Create database tables
echo Creating database tables...
sqlplus -S %DB_USER%/%DB_PASSWORD%@%DB_CONNECTION% @database_oracle.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Database tables created successfully!
    echo ========================================
    echo.
) else (
    echo.
    echo ERROR: Failed to create database tables
    pause
    exit /b 1
)

REM Create .env file
echo Creating .env file...
(
    echo PORT=5000
    echo DB_USER=%DB_USER%
    echo DB_PASSWORD=%DB_PASSWORD%
    echo DB_CONNECTION_STRING=%DB_CONNECTION%
    echo JWT_SECRET=careerlens_secret_key_%RANDOM%%RANDOM%
) > .env

echo .env file created!
echo.

REM Install Node.js dependencies
echo Installing Node.js dependencies...
call npm install

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Setup completed successfully!
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Review the .env file if needed
    echo 2. Run: npm run dev
    echo 3. Server will start on http://localhost:5000
    echo.
) else (
    echo.
    echo ERROR: Failed to install Node.js dependencies
    echo Please run 'npm install' manually
)

pause
