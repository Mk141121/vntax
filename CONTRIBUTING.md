# Contributing to Vietnam Tax Calculator

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## 🤝 How to Contribute

### Reporting Bugs

Before creating a bug report:
1. Check existing issues to avoid duplicates
2. Verify the bug in the latest version
3. Collect relevant information

Create a bug report with:
- Clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, version)

### Suggesting Enhancements

Enhancement suggestions are welcome! Please:
1. Check if it's already suggested
2. Provide clear use cases
3. Explain the expected benefits
4. Consider implementation complexity

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit with clear messages
6. Push to your fork
7. Open a Pull Request

## 📋 Development Process

### Setup Development Environment

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/vietnam-tax-calculator.git
cd vietnam-tax-calculator

# Install dependencies
npm install

# Start development server
npm run dev
```

### Code Style

We use:
- **TypeScript** (strict mode)
- **ESLint** for linting
- **Prettier** for formatting (if configured)

Follow these conventions:
- Use functional components with hooks
- Prefer `const` over `let`
- Use meaningful variable names
- Add JSDoc comments for functions
- Keep components small and focused
- Use TypeScript types (avoid `any`)

Example:
```typescript
/**
 * Calculate progressive tax for given income
 * @param taxableIncome - Income subject to tax
 * @returns Tax amount and breakdown
 */
export function calculateProgressiveTax(
  taxableIncome: number
): { tax: number; breakdown: TaxBreakdown[] } {
  // Implementation
}
```

### Component Structure

```typescript
"use client"; // Only if needed

import { useState } from 'react';
import { motion } from 'framer-motion';
// ... other imports

interface ComponentProps {
  // Props definition
}

export function ComponentName({ prop1, prop2 }: ComponentProps) {
  // Component logic
  
  return (
    // JSX
  );
}
```

### File Organization

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── form/        # Form components
│   ├── result/      # Result display components
│   └── ui/          # shadcn/ui components
├── lib/             # Utility functions and logic
│   └── tax/         # Tax calculation logic
├── store/           # State management
└── styles/          # Global styles
```

## 🧪 Testing

### Before Submitting

1. Test all calculations manually
2. Check responsive design (mobile/desktop)
3. Verify animations work smoothly
4. Test API endpoints
5. Run linting: `npm run lint`
6. Build successfully: `npm run build`

### Test Cases

When modifying tax logic, test:
- Zero income
- Small income (under first bracket)
- Income spanning multiple brackets
- Maximum income (high brackets)
- Various dependent counts (0, 1, 5, 10)
- Various insurance rates (0%, 10.5%, 15%)
- Edge cases and boundaries

## 📝 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat(calculator): add support for bonus tax calculation

fix(form): resolve input validation issue for large numbers

docs(readme): update installation instructions

style(components): format code with prettier
```

## 🔍 Code Review Process

All submissions require review. We review:
- Code quality and style
- Functionality and correctness
- Performance implications
- Documentation completeness
- Test coverage

## 🎯 Areas for Contribution

### High Priority
- Bug fixes
- Documentation improvements
- Performance optimizations
- Accessibility enhancements
- Test coverage

### Feature Ideas
- Dark mode
- Vietnamese language support
- PDF export
- Calculation history
- Tax optimization tips
- 13th month salary calculator
- Bonus tax calculator

### Tax Logic
**IMPORTANT**: Changes to tax calculation logic require:
- Reference to official Vietnamese tax law
- Verification from multiple sources
- Clear documentation
- Extensive testing

## 📚 Resources

### Vietnamese Tax Law
- [General Department of Taxation](https://www.gdt.gov.vn/)
- Personal Income Tax Law documents
- Official tax brackets and rates

### Technical Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

## ⚖️ Legal Considerations

When contributing:
- Only use verified tax information
- Do not add speculative tax rules
- Include disclaimers for informational purposes
- Respect copyright and licenses
- Maintain user privacy

## 🚫 What Not to Do

- Don't commit directly to main
- Don't include personal information
- Don't add unnecessary dependencies
- Don't remove safety checks
- Don't make breaking changes without discussion
- Don't add unverified tax calculations

## 💬 Communication

- Open issues for discussion
- Be respectful and constructive
- Provide context and examples
- Follow up on feedback
- Be patient with review process

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

## 🙏 Recognition

Contributors will be:
- Listed in the project
- Mentioned in release notes
- Credited in documentation

## 📞 Questions?

- Open an issue for questions
- Check existing documentation first
- Be specific and provide context

---

Thank you for contributing to make this calculator better! 🎉
