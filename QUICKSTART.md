# 🚀 Quick Start Guide

Get the Vietnam Tax Calculator running in 5 minutes!

## Prerequisites

- **Node.js 18+** ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- A code editor (VS Code recommended)

## Installation

### Option 1: Quick Setup (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd vietnam-tax-calculator

# Make setup script executable (macOS/Linux)
chmod +x setup.sh

# Run setup script
./setup.sh
```

The setup script will:
1. Check your Node.js installation
2. Install all dependencies
3. Start the development server

### Option 2: Manual Setup

```bash
# Clone the repository
git clone <repository-url>
cd vietnam-tax-calculator

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🎉 That's it!

Open your browser and go to:
```
http://localhost:3000
```

You should see the Vietnam Tax Calculator running!

## 📱 What You Can Do

### Try These Examples:

1. **Basic Calculation**
   - Gross Income: 20,000,000 VND
   - Dependents: 0
   - Watch the results update instantly!

2. **With Dependents**
   - Gross Income: 30,000,000 VND
   - Dependents: 2
   - See how deductions reduce your tax

3. **Adjust Insurance**
   - Use the slider to change insurance rate
   - See real-time calculation updates

4. **High Income**
   - Try 100,000,000 VND
   - See progressive tax brackets in action

## 🎨 Features to Explore

- ✨ **Instant calculations** - No submit button needed
- 📊 **Visual charts** - Pie and bar charts
- 📋 **Tax breakdown** - See tax by bracket
- 📱 **Responsive** - Try on mobile
- 🎭 **Smooth animations** - Watch the numbers count up

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📂 Project Structure

```
vietnam-tax-calculator/
├── src/
│   ├── app/              # Pages and API routes
│   ├── components/       # React components
│   ├── lib/             # Tax calculation logic
│   ├── store/           # State management
│   └── styles/          # Global styles
├── public/              # Static assets
└── package.json         # Dependencies
```

## 🔧 Common Issues

### Port Already in Use?

```bash
# Use a different port
PORT=3001 npm run dev
```

### Build Errors?

```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

### Node Version Issues?

Check your Node version:
```bash
node --version
```

Should be 18.0.0 or higher. If not, update Node.js.

## 📚 Next Steps

1. **Read the [README.md](README.md)** for detailed documentation
2. **Check [DEPLOYMENT.md](DEPLOYMENT.md)** for hosting options
3. **See [CONTRIBUTING.md](CONTRIBUTING.md)** to contribute
4. **Review the code** in `src/` to understand the implementation

## 🎓 Learn More

### Tax Calculation Logic
- See `src/lib/tax/calculator.ts` for main logic
- Check `src/lib/tax/rules-2025.ts` for tax rules
- Review `src/lib/tax/progressive.ts` for bracket calculations

### UI Components
- Forms: `src/components/form/`
- Results: `src/components/result/`
- Base UI: `src/components/ui/`

### State Management
- Zustand store: `src/store/tax-store.ts`
- Global state for instant updates

## 🆘 Need Help?

- 📖 Check the [README.md](README.md)
- 🐛 Report issues on GitHub
- 💬 Ask questions in Discussions
- 📧 Contact maintainers

## 🎯 Quick Tips

1. **No Submit Button** - Just type, results update instantly
2. **All Inclusive** - Insurance, deductions, everything is calculated
3. **Visual** - Charts help you understand your tax breakdown
4. **Accurate** - Based on official 2025 Vietnamese tax law
5. **Fast** - Optimized for performance

## ✅ Checklist

After installation, you should be able to:
- [ ] Open http://localhost:3000
- [ ] See the calculator interface
- [ ] Enter income and see results
- [ ] Adjust dependents and insurance
- [ ] View charts and breakdown
- [ ] See smooth animations

## 🚀 Deploy Your Own

Once you're happy with the calculator:

1. **Vercel** (easiest):
   - Push to GitHub
   - Import on Vercel
   - Deploy!

2. **Docker**:
   ```bash
   docker build -t vietnam-tax-calculator .
   docker run -p 3000:3000 vietnam-tax-calculator
   ```

3. **Self-host**:
   ```bash
   npm run build
   npm start
   ```

## 🎊 You're Ready!

Start calculating taxes and explore the features. Happy calculating! 🇻🇳

---

**Questions?** Open an issue on GitHub or check the documentation.
