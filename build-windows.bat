@echo off
REM Windows batch script to build the Electron app installer

echo ======================================
echo DP Portfolio Desktop - Build for Windows
echo ======================================
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
    echo.
)

echo Building Windows installer...
echo This may take a few minutes...
echo.
call npm run build

if %errorlevel% equ 0 (
    echo.
    echo ======================================
    echo Build successful!
    echo The installer can be found in the 'dist' folder
    echo ======================================
) else (
    echo.
    echo ERROR: Build failed!
)

pause
