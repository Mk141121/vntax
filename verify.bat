@echo off
REM Vietnam Tax Calculator - Verification Script (Windows)
REM This script checks if all files are present and properly configured

echo.
echo Vietnam Tax Calculator - Verification Check
echo ==================================================
echo.

set ERRORS=0
set WARNINGS=0

echo Checking Configuration Files...
call :check_file "package.json"
call :check_file "tsconfig.json"
call :check_file "next.config.js"
call :check_file "tailwind.config.js"
call :check_file "postcss.config.js"
call :check_file ".eslintrc.json"
call :check_file "components.json"
call :check_file ".gitignore"
echo.

echo Checking Source Directories...
call :check_dir "src"
call :check_dir "src\app"
call :check_dir "src\components"
call :check_dir "src\lib"
call :check_dir "src\store"
call :check_dir "src\styles"
echo.

echo Checking Core Files...
call :check_file "src\app\layout.tsx"
call :check_file "src\app\page.tsx"
call :check_file "src\app\api\tax\route.ts"
echo.

echo Checking Components...
call :check_file "src\components\form\IncomeForm.tsx"
call :check_file "src\components\form\DeductionForm.tsx"
call :check_file "src\components\result\TaxSummary.tsx"
call :check_file "src\components\result\TaxBreakdownTable.tsx"
call :check_file "src\components\result\TaxChart.tsx"
echo.

echo Checking Documentation...
call :check_file "README.md"
call :check_file "QUICKSTART.md"
call :check_file "LICENSE"
echo.

echo ==================================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Node.js installed
    node --version
) else (
    echo [ERROR] Node.js not installed
    set /a ERRORS+=1
)

REM Check npm
where npm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] npm installed
    npm --version
) else (
    echo [ERROR] npm not installed
    set /a ERRORS+=1
)

echo.

REM Check if node_modules exists
if exist "node_modules" (
    echo [OK] Dependencies installed
) else (
    echo [WARNING] Dependencies not installed yet
    echo Run: npm install
    set /a WARNINGS+=1
)

echo.
echo ==================================================
echo.

if %ERRORS% EQU 0 (
    if %WARNINGS% EQU 0 (
        echo [OK] All checks passed!
        echo.
        echo Your Vietnam Tax Calculator is ready!
        echo.
        echo Next steps:
        echo 1. Install dependencies: npm install
        echo 2. Start dev server: npm run dev
        echo 3. Open http://localhost:3000
    ) else (
        echo [WARNING] Found %WARNINGS% warning(s)
    )
) else (
    echo [ERROR] Found %ERRORS% error(s)
    echo Please fix the issues above before proceeding.
)

echo.
pause
exit /b %ERRORS%

:check_file
if exist "%~1" (
    echo [OK] %~1
) else (
    echo [ERROR] %~1 - MISSING
    set /a ERRORS+=1
)
exit /b

:check_dir
if exist "%~1\" (
    echo [OK] %~1\
) else (
    echo [ERROR] %~1\ - MISSING
    set /a ERRORS+=1
)
exit /b
