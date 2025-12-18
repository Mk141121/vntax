# Changelog

All notable changes to the Vietnam Tax Calculator project will be documented in this file.

## [1.0.0] - 2025-01-01

### 🎉 Initial Release

#### Features
- **Tax Calculator Engine**
  - Accurate Vietnam PIT calculations for 2025
  - Progressive tax bracket implementation
  - Support for personal and dependent deductions
  - Adjustable insurance rates (default 10.5%)
  - Monthly and yearly calculations

- **User Interface**
  - Modern, clean SaaS-style design
  - Instant calculation (no submit button)
  - Responsive layout (desktop and mobile)
  - Income and deduction input forms
  - Real-time validation

- **Results Display**
  - Tax summary with breakdown
  - Progressive tax bracket table
  - Pie chart for income distribution
  - Bar chart for monthly vs yearly comparison
  - Yearly projections

- **Animations**
  - Count-up animation for net income
  - Fade and slide transitions
  - Smooth chart updates
  - Staggered entrance animations

- **Technical Features**
  - TypeScript with strict mode
  - Next.js 14 App Router
  - API routes for tax calculations
  - Zustand state management
  - Zod validation
  - shadcn/ui components
  - Framer Motion animations
  - Recharts integration

#### Components
- `IncomeForm` - Income input with validation
- `DeductionForm` - Insurance and deduction controls
- `TaxSummary` - Main results display
- `TaxBreakdownTable` - Progressive tax details
- `TaxChart` - Visual data representation

#### API
- `POST /api/tax` - Calculate tax with JSON body
- `GET /api/tax` - Calculate tax with query parameters

#### Documentation
- Comprehensive README
- Deployment guide
- API documentation
- Code comments and JSDoc
- Type definitions

### 🛠️ Technical Details

#### Dependencies
- next: ^14.2.0
- react: ^18.3.0
- typescript: ^5.4.0
- tailwindcss: ^3.4.0
- zustand: ^4.5.0
- zod: ^3.23.0
- framer-motion: ^11.0.0
- recharts: ^2.12.0
- lucide-react: ^0.372.0
- shadcn/ui components via Radix UI

#### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

### 📋 Tax Rules

Based on Vietnamese Personal Income Tax Law 2025:
- Personal deduction: 11,000,000 VND/month
- Dependent deduction: 4,400,000 VND/person/month
- 7 progressive tax brackets (5% to 35%)
- Default insurance: 10.5% (8% + 1.5% + 1%)

### 🔮 Future Enhancements

Planned for future releases:
- [ ] Dark mode toggle
- [ ] Multiple language support (Vietnamese/English)
- [ ] Export results to PDF
- [ ] Save calculations history
- [ ] Compare multiple scenarios
- [ ] Annual 13th month salary calculation
- [ ] Bonus tax calculation
- [ ] Tax optimization suggestions
- [ ] Historical tax data comparison
- [ ] Mobile app version

### 🐛 Known Issues

None at this time.

### 📝 Notes

- This calculator is for informational purposes only
- Tax rules are based on 2025 Vietnamese law
- Consult with tax professionals for official advice

---

## Version History

### Versioning Scheme
- MAJOR.MINOR.PATCH
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes

### Release Schedule
- Major releases: Yearly (with tax law updates)
- Minor releases: As needed
- Patches: As needed

---

For detailed commit history, see the [Git log](https://github.com/yourusername/vietnam-tax-calculator/commits/main).
