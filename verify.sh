#!/bin/bash

# Vietnam Tax Calculator - Verification Script
# This script checks if all files are present and properly configured

echo "🇻🇳 Vietnam Tax Calculator - Verification Check"
echo "=================================================="
echo ""

ERRORS=0
WARNINGS=0

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check function
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1 - MISSING"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        return 0
    else
        echo -e "${RED}✗${NC} $1/ - MISSING"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

echo "📁 Checking Configuration Files..."
check_file "package.json"
check_file "tsconfig.json"
check_file "next.config.js"
check_file "tailwind.config.js"
check_file "postcss.config.js"
check_file ".eslintrc.json"
check_file "components.json"
check_file ".gitignore"
echo ""

echo "📁 Checking Source Directories..."
check_dir "src"
check_dir "src/app"
check_dir "src/components"
check_dir "src/lib"
check_dir "src/store"
check_dir "src/styles"
echo ""

echo "📄 Checking Core Files..."
check_file "src/app/layout.tsx"
check_file "src/app/page.tsx"
check_file "src/app/api/tax/route.ts"
echo ""

echo "📄 Checking Components..."
check_file "src/components/form/IncomeForm.tsx"
check_file "src/components/form/DeductionForm.tsx"
check_file "src/components/result/TaxSummary.tsx"
check_file "src/components/result/TaxBreakdownTable.tsx"
check_file "src/components/result/TaxChart.tsx"
echo ""

echo "📄 Checking UI Components..."
check_file "src/components/ui/button.tsx"
check_file "src/components/ui/card.tsx"
check_file "src/components/ui/input.tsx"
check_file "src/components/ui/label.tsx"
check_file "src/components/ui/slider.tsx"
check_file "src/components/ui/tooltip.tsx"
check_file "src/components/ui/separator.tsx"
echo ""

echo "📄 Checking Tax Logic..."
check_file "src/lib/tax/types.ts"
check_file "src/lib/tax/rules-2025.ts"
check_file "src/lib/tax/calculator.ts"
check_file "src/lib/tax/progressive.ts"
check_file "src/lib/utils.ts"
echo ""

echo "📄 Checking State Management..."
check_file "src/store/tax-store.ts"
echo ""

echo "📄 Checking Styles..."
check_file "src/styles/globals.css"
echo ""

echo "📚 Checking Documentation..."
check_file "README.md"
check_file "QUICKSTART.md"
check_file "API.md"
check_file "DEPLOYMENT.md"
check_file "CONTRIBUTING.md"
check_file "TESTING.md"
check_file "CHANGELOG.md"
check_file "PROJECT_SUMMARY.md"
check_file "LICENSE"
echo ""

echo "🐳 Checking Docker Files..."
check_file "Dockerfile"
check_file "docker-compose.yml"
check_file ".dockerignore"
echo ""

echo "🚀 Checking Setup Scripts..."
check_file "setup.sh"
check_file "setup.bat"
echo ""

echo "🔧 Checking CI/CD..."
check_file ".github/workflows/ci.yml"
echo ""

echo "=================================================="
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js installed: $NODE_VERSION"
    
    # Check if version is 18 or higher
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$MAJOR_VERSION" -lt 18 ]; then
        echo -e "${YELLOW}⚠${NC} Warning: Node.js 18+ recommended (you have v$MAJOR_VERSION)"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${RED}✗${NC} Node.js not installed"
    ERRORS=$((ERRORS + 1))
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓${NC} npm installed: v$NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm not installed"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} Dependencies installed (node_modules exists)"
else
    echo -e "${YELLOW}⚠${NC} Dependencies not installed yet"
    echo "  Run: npm install"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo "=================================================="
echo ""

# Summary
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "Your Vietnam Tax Calculator is ready!"
    echo ""
    echo "Next steps:"
    echo "1. Install dependencies: npm install"
    echo "2. Start dev server: npm run dev"
    echo "3. Open http://localhost:3000"
else
    if [ $ERRORS -gt 0 ]; then
        echo -e "${RED}✗ Found $ERRORS error(s)${NC}"
    fi
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠ Found $WARNINGS warning(s)${NC}"
    fi
    echo ""
    echo "Please fix the issues above before proceeding."
fi

echo ""

exit $ERRORS
