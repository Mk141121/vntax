# Testing Guide

Guidelines and examples for testing the Vietnam Tax Calculator.

## 🧪 Test Philosophy

- **Accuracy First**: Tax calculations must be 100% correct
- **Edge Cases**: Test boundaries and unusual inputs
- **User Experience**: Verify smooth interactions
- **Performance**: Ensure fast calculations

## 📋 Manual Testing Checklist

### Tax Calculation Accuracy

#### Basic Cases
- [ ] Zero income → Zero tax
- [ ] Income below all deductions → Zero taxable, zero tax
- [ ] Small income (5M) → Correct 5% bracket tax
- [ ] Income at bracket boundary (10M) → Correct calculation
- [ ] Income spanning multiple brackets → Progressive calculation

#### With Dependents
- [ ] 0 dependents → Only personal deduction
- [ ] 1 dependent → +4.4M deduction
- [ ] 5 dependents → +22M deduction
- [ ] 10 dependents → +44M deduction

#### Insurance Rates
- [ ] 0% insurance → No insurance deduction
- [ ] 10.5% insurance (default) → Correct calculation
- [ ] 15% insurance → Correct calculation
- [ ] Slider updates → Instant recalculation

#### High Income
- [ ] 50M income → Multiple brackets
- [ ] 100M income → High bracket (35%)
- [ ] 1B income → Correct calculation

### User Interface

#### Input Validation
- [ ] Negative income → Prevented or handled
- [ ] Very large numbers → Handled correctly
- [ ] Decimal numbers → Accepted
- [ ] Non-numeric input → Rejected
- [ ] Dependents must be integer

#### Real-time Updates
- [ ] Typing in income → Immediate update
- [ ] Changing dependents → Immediate update
- [ ] Sliding insurance → Immediate update
- [ ] No lag or delays

#### Responsive Design
- [ ] Desktop (1920px) → Proper layout
- [ ] Laptop (1366px) → Proper layout
- [ ] Tablet (768px) → Mobile layout
- [ ] Mobile (375px) → Single column
- [ ] All components visible and usable

#### Animations
- [ ] Page load → Smooth entrance
- [ ] Number changes → Count-up animation
- [ ] Chart updates → Smooth transitions
- [ ] No jank or stuttering

### Components

#### Forms
- [ ] Income input → Formats with commas
- [ ] Dependent input → Integer only
- [ ] Insurance slider → Smooth dragging
- [ ] Tooltips → Show on hover

#### Results
- [ ] Tax summary → Shows all values
- [ ] Net income → Prominent display
- [ ] Breakdown table → All brackets shown
- [ ] Mobile table → Card view works

#### Charts
- [ ] Pie chart → Correct proportions
- [ ] Bar chart → Correct heights
- [ ] Tooltips → Show on hover
- [ ] Legend → Correct colors
- [ ] Responsive → Scales properly

### API

#### POST Endpoint
- [ ] Valid input → 200 OK
- [ ] Invalid input → 400 Bad Request
- [ ] Missing fields → 400 with details
- [ ] Correct calculation → Matches frontend

#### GET Endpoint
- [ ] Query parameters → Works correctly
- [ ] Same results as POST → Consistent

### Performance

- [ ] Initial load → < 3 seconds
- [ ] Calculation time → < 100ms
- [ ] Chart rendering → < 500ms
- [ ] No memory leaks → Stable over time

### Browser Compatibility

- [ ] Chrome (latest) → Works
- [ ] Firefox (latest) → Works
- [ ] Safari (latest) → Works
- [ ] Edge (latest) → Works
- [ ] Mobile Safari → Works
- [ ] Mobile Chrome → Works

---

## 🔢 Test Cases

### Test Case 1: Minimum Wage Worker

**Input:**
```
Gross Income: 5,000,000 VND
Dependents: 0
Insurance: 10.5%
```

**Expected Output:**
```
Insurance: 525,000 VND
Taxable Income: 0 VND (5M - 0.525M - 11M < 0)
Tax: 0 VND
Net Income: 4,475,000 VND
```

### Test Case 2: Average Income, Single

**Input:**
```
Gross Income: 20,000,000 VND
Dependents: 0
Insurance: 10.5%
```

**Expected Output:**
```
Insurance: 2,100,000 VND
Personal: 11,000,000 VND
Taxable: 6,900,000 VND
Tax: 345,000 VND (6.9M × 5%)
Net: 17,555,000 VND
```

### Test Case 3: Family with Children

**Input:**
```
Gross Income: 30,000,000 VND
Dependents: 2
Insurance: 10.5%
```

**Expected Output:**
```
Insurance: 3,150,000 VND
Personal: 11,000,000 VND
Dependent: 8,800,000 VND
Taxable: 7,050,000 VND
Tax: 352,500 VND
Net: 26,497,500 VND
```

### Test Case 4: High Income

**Input:**
```
Gross Income: 100,000,000 VND
Dependents: 0
Insurance: 10.5%
```

**Expected Bracket Breakdown:**
```
Bracket 1 (0-5M): 250,000 VND
Bracket 2 (5-10M): 500,000 VND
Bracket 3 (10-18M): 1,200,000 VND
Bracket 4 (18-32M): 2,800,000 VND
Bracket 5 (32-52M): 5,000,000 VND
Bracket 6 (52-78.5M): 7,950,000 VND
Total Tax: 17,700,000 VND (approximately)
```

### Test Case 5: Edge Case - Exact Bracket Boundary

**Input:**
```
Gross Income: 21,500,000 VND
Dependents: 0
Insurance: 10.5%
```

**Expected:**
```
Taxable: 8,145,000 VND
First 5M at 5%: 250,000 VND
Remaining 3.145M at 10%: 314,500 VND
Total Tax: 564,500 VND
```

---

## 🤖 Automated Testing (Future)

### Unit Tests

```typescript
// Example: lib/tax/calculator.test.ts
import { calculateTax } from './calculator';

describe('Tax Calculator', () => {
  test('zero income returns zero tax', () => {
    const result = calculateTax({
      grossIncome: 0,
      dependents: 0,
      insuranceRate: 10.5,
    });
    
    expect(result.totalTax).toBe(0);
    expect(result.netIncome).toBe(0);
  });

  test('income below deductions returns zero tax', () => {
    const result = calculateTax({
      grossIncome: 5_000_000,
      dependents: 0,
      insuranceRate: 10.5,
    });
    
    expect(result.taxableIncome).toBe(0);
    expect(result.totalTax).toBe(0);
  });

  test('calculates tax correctly for 20M income', () => {
    const result = calculateTax({
      grossIncome: 20_000_000,
      dependents: 0,
      insuranceRate: 10.5,
    });
    
    expect(result.insuranceDeduction).toBe(2_100_000);
    expect(result.taxableIncome).toBe(6_900_000);
    expect(result.totalTax).toBe(345_000);
  });

  test('applies dependent deductions correctly', () => {
    const result = calculateTax({
      grossIncome: 30_000_000,
      dependents: 2,
      insuranceRate: 10.5,
    });
    
    expect(result.dependentDeduction).toBe(8_800_000);
  });
});
```

### Integration Tests

```typescript
// Example: app/api/tax/route.test.ts
import { POST } from './route';

describe('Tax API', () => {
  test('returns 200 for valid input', async () => {
    const request = new Request('http://localhost/api/tax', {
      method: 'POST',
      body: JSON.stringify({
        grossIncome: 20_000_000,
        dependents: 0,
        insuranceRate: 10.5,
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
  });

  test('returns 400 for invalid input', async () => {
    const request = new Request('http://localhost/api/tax', {
      method: 'POST',
      body: JSON.stringify({
        grossIncome: -1000,
        dependents: 0,
        insuranceRate: 10.5,
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
```

### Component Tests

```typescript
// Example: components/form/IncomeForm.test.tsx
import { render, fireEvent } from '@testing-library/react';
import { IncomeForm } from './IncomeForm';

describe('IncomeForm', () => {
  test('renders income input', () => {
    const { getByLabelText } = render(<IncomeForm />);
    expect(getByLabelText('Gross Income')).toBeInTheDocument();
  });

  test('formats numbers with commas', () => {
    const { getByLabelText } = render(<IncomeForm />);
    const input = getByLabelText('Gross Income');
    
    fireEvent.change(input, { target: { value: '20000000' } });
    expect(input.value).toBe('20,000,000');
  });
});
```

---

## 📊 Performance Testing

### Metrics to Track

- **Initial Load**: < 3 seconds
- **Calculation Time**: < 100ms
- **Chart Render**: < 500ms
- **Input Responsiveness**: < 50ms
- **Memory Usage**: Stable (no leaks)

### Tools

- Chrome DevTools Performance
- Lighthouse
- WebPageTest
- React DevTools Profiler

---

## ✅ Regression Testing

Before each release, test:

1. All manual test cases
2. All automated tests (when implemented)
3. Browser compatibility
4. Mobile responsiveness
5. Performance metrics
6. API endpoints

---

## 🐛 Bug Reporting

When filing bugs, include:

1. **Environment**: Browser, OS, device
2. **Steps to Reproduce**: Exact sequence
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Screenshots**: If applicable
6. **Console Errors**: Any error messages

---

## 📝 Test Data

### Sample Incomes (VND/month)
- Minimum: 5,000,000
- Low: 10,000,000
- Average: 20,000,000
- Above Average: 30,000,000
- High: 50,000,000
- Very High: 100,000,000

### Sample Dependents
- Single: 0
- Couple: 1
- Small Family: 2
- Large Family: 4
- Extended Family: 6

---

## 🎯 Coverage Goals

- Unit Tests: > 80%
- Integration Tests: > 70%
- E2E Tests: Critical paths
- Manual Testing: 100% checklist

---

## 📞 Questions?

For testing help:
- Review this guide
- Check example tests
- Ask in GitHub Discussions
- Contact maintainers
