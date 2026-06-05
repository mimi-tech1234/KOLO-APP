@echo off
REM Kolo App - Database Setup Script for Windows
REM This script initializes the PostgreSQL database with schema and seed data

setlocal enabledelayedexpansion

echo ================================
echo Kolo App - Database Setup
echo ================================
echo.

REM Database configuration
set DB_HOST=%DB_HOST:localhost=localhost%
set DB_PORT=%DB_PORT:5432=5432%
set DB_USER=%DB_USER:kolo_user=kolo_user%
set DB_PASSWORD=%DB_PASSWORD:kolo_password_dev=kolo_password_dev%
set DB_NAME=%DB_NAME:kolo_db=kolo_db%

echo Database Configuration:
echo   Host: %DB_HOST%
echo   Port: %DB_PORT%
echo   User: %DB_USER%
echo   Database: %DB_NAME%
echo.

echo Creating database...
set PGPASSWORD=%DB_PASSWORD%

psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "SELECT 1" >nul 2>&1
if errorlevel 1 (
  echo Creating new database...
  psql -h %DB_HOST% -p %DB_PORT% -U postgres -c "CREATE DATABASE %DB_NAME%;" || echo Database already exists or could not be created
) else (
  echo Database already exists
)

echo Running schema migrations...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f packages\db\schema.sql
if errorlevel 1 goto error

echo Seeding database...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f packages\db\seed.sql
if errorlevel 1 goto error

set PGPASSWORD=
echo.
echo ================================
echo * Database setup complete!
echo ================================
echo.
echo Connection string:
echo   postgresql://%DB_USER%:***@%DB_HOST%:%DB_PORT%/%DB_NAME%
endlocal
exit /b 0

:error
set PGPASSWORD=
echo ERROR: Database setup failed!
exit /b 1
