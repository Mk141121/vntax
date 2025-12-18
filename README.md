# Vietnam Personal Income Tax Calculator 2025

A modern, fullstack Next.js application for calculating Vietnam Personal Income Tax (PIT) with instant results and smooth animations.

## 🚀 Features

- **Instant Calculations** - No submit button needed, updates as you type
- **Progressive Tax Brackets** - Accurate 2025 Vietnamese PIT calculations
- **Modern UI** - Clean, SaaS-style interface with Tailwind CSS and shadcn/ui
- **Smooth Animations** - Framer Motion powered transitions
- **Interactive Charts** - Pie and bar charts with Recharts
- **Responsive Design** - Works perfectly on desktop and mobile
- **TypeScript** - Fully typed for better developer experience
- **API Routes** - RESTful API endpoints for tax calculations

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Validation**: Zod
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vietnam-tax-calculator
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Main calculator page
│   └── api/
│       └── tax/
│           └── route.ts     # API endpoint for tax calculations
│
├── components/
│   ├── form/
│   │   ├── IncomeForm.tsx           # Income input form
│   │   └── DeductionForm.tsx        # Deduction controls
│   ├── result/
│   │   ├── TaxSummary.tsx           # Tax summary card
│   │   ├── TaxBreakdownTable.tsx    # Progressive tax breakdown
│   │   └── TaxChart.tsx             # Pie and bar charts
│   └── ui/                  # shadcn/ui components
│
├── lib/
│   ├── tax/
│   │   ├── rules-2025.ts    # Vietnam tax rules and constants
│   │   ├── calculator.ts    # Main tax calculation logic
│   │   ├── progressive.ts   # Progressive tax bracket calculations
│   │   └── types.ts         # TypeScript types
│   └── utils.ts             # Utility functions
│
├── store/
│   └── tax-store.ts         # Zustand global state
│
└── styles/
    └── globals.css          # Global styles and Tailwind
```

## 💰 Tax Calculation Rules (2025)

### Deductions
- **Personal Deduction**: 11,000,000 VND/month
- **Dependent Deduction**: 4,400,000 VND per person/month
- **Insurance Rate**: 10.5% (default - adjustable)
  - Social Insurance (BHXH): 8%
  - Health Insurance (BHYT): 1.5%
  - Unemployment Insurance (BHTN): 1%

### Progressive Tax Brackets
| Income Range (VND/month) | Tax Rate |
|-------------------------|----------|
| 0 - 5,000,000          | 5%       |
| 5,000,001 - 10,000,000 | 10%      |
| 10,000,001 - 18,000,000| 15%      |
| 18,000,001 - 32,000,000| 20%      |
| 32,000,001 - 52,000,000| 25%      |
| 52,000,001 - 80,000,000| 30%      |
| Above 80,000,000       | 35%      |

### Calculation Flow
```
Gross Income
  → Minus Insurance (10.5% default)
  → Minus Personal Deduction (11M VND)
  → Minus Dependent Deduction (4.4M × dependents)
  → = Taxable Income
  → Apply Progressive Tax Brackets
  → = Income Tax
  → Net Income = Gross - Insurance - Tax
```

## 🔌 API Usage

### POST /api/tax
Calculate tax with JSON body:
```bash
curl -X POST http://localhost:3000/api/tax \
  -H "Content-Type: application/json" \
  -d '{
    "grossIncome": 20000000,
    "dependents": 2,
    "insuranceRate": 10.5
  }'
```

### GET /api/tax
Calculate tax with query parameters:
```bash
curl "http://localhost:3000/api/tax?grossIncome=20000000&dependents=2&insuranceRate=10.5"
```

## 🎨 Customization

### Updating Tax Rules
Edit `src/lib/tax/rules-2025.ts` to update:
- Tax brackets
- Deduction amounts
- Insurance rates
- Labels and descriptions

### Styling
- Modify `tailwind.config.js` for theme customization
- Edit `src/styles/globals.css` for custom CSS
- Update CSS variables in `globals.css` for color scheme

## 📱 Features in Detail

### Instant Calculation
- No submit button required
- Debounced input for smooth performance
- Live updates on every change

### Animations
- Count-up animation for net income
- Fade and slide transitions for cards
- Smooth chart updates
- Staggered entrance animations

### Charts
- **Pie Chart**: Income distribution breakdown
- **Bar Chart**: Monthly vs yearly comparison
- Interactive tooltips
- Responsive design

### Responsive Design
- Desktop: 2-column layout
- Mobile: Single column, stacked
- Mobile-friendly tables with card fallback

## 🧪 Development

### Build for production:
```bash
npm run build
```

### Start production server:
```bash
npm start
```

### Lint code:
```bash
npm run lint
```

## ⚖️ Legal Notice

This calculator is for informational purposes only and based on current Vietnamese Personal Income Tax law as of 2025. For official tax advice, please consult with a qualified tax professional or the Vietnamese tax authorities.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

Made with ❤️ for the Vietnamese community
