@echo off
REM Kolo App - Development Setup Script for Windows

setlocal enabledelayedexpansion

echo ================================
echo Kolo App - Development Setup
echo ================================
echo.

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
  echo ERROR: Node.js is not installed!
  echo Please install Node.js 18+ from https://nodejs.org
  exit /b 1
)

echo Node version:
node --version
echo npm version:
npm --version
echo.

echo Installing root dependencies...
call npm install
if errorlevel 1 goto error

echo Installing API dependencies...
call npm --workspace @kolo/api install
if errorlevel 1 goto error

echo Installing Web dependencies...
call npm --workspace @kolo/web install
if errorlevel 1 goto error

echo Installing Mobile dependencies...
call npm --workspace @kolo/mobile install
if errorlevel 1 goto error

echo.
echo ================================
echo * Setup complete!
echo ================================
echo.
echo Available commands:
echo   npm run dev:api      - Start API server (port 4000)
echo   npm run dev:web      - Start Web app (port 5173)
echo   npm run dev:mobile   - Start Mobile dev server
echo   npm run start:api    - Start API in production mode
echo.
echo Next steps:
echo   1. Copy .env.example to .env and configure
echo   2. Set up database: setup-db.bat
echo   3. Run: npm run dev:api
echo.
endlocal
exit /b 0

:error
echo ERROR: Setup failed!
exit /b 1
