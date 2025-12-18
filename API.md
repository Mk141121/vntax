# API Documentation

The Vietnam Tax Calculator provides RESTful API endpoints for programmatic tax calculations.

## Base URL

```
Development: http://localhost:3000
Production: https://yourdomain.com
```

## Endpoints

### Calculate Tax

Calculate Vietnam Personal Income Tax based on input parameters.

#### `POST /api/tax`

**Request Body:**

```json
{
  "grossIncome": 20000000,
  "dependents": 2,
  "insuranceRate": 10.5
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `grossIncome` | number | Yes | Monthly gross income in VND |
| `dependents` | number | Yes | Number of dependents (0 or more) |
| `insuranceRate` | number | Yes | Insurance rate as percentage (0-100) |

**Response:**

```json
{
  "success": true,
  "data": {
    "grossIncome": 20000000,
    "insuranceDeduction": 2100000,
    "personalDeduction": 11000000,
    "dependentDeduction": 8800000,
    "totalDeductions": 21900000,
    "taxableIncome": 0,
    "totalTax": 0,
    "netIncome": 17900000,
    "effectiveRate": 0,
    "breakdown": []
  }
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `grossIncome` | number | Input gross income |
| `insuranceDeduction` | number | Mandatory insurance amount |
| `personalDeduction` | number | Personal deduction (11M VND) |
| `dependentDeduction` | number | Total dependent deduction |
| `totalDeductions` | number | Sum of all deductions |
| `taxableIncome` | number | Income subject to tax |
| `totalTax` | number | Total income tax |
| `netIncome` | number | Take-home amount |
| `effectiveRate` | number | Average tax rate (%) |
| `breakdown` | array | Tax calculation by bracket |

**Breakdown Object:**

```json
{
  "bracket": 1,
  "from": 0,
  "to": 5000000,
  "taxableAmount": 5000000,
  "rate": 0.05,
  "tax": 250000
}
```

**Error Response:**

```json
{
  "error": "Invalid input",
  "details": [
    {
      "code": "too_small",
      "minimum": 0,
      "type": "number",
      "inclusive": true,
      "message": "Gross income must be non-negative",
      "path": ["grossIncome"]
    }
  ]
}
```

**Example Request (cURL):**

```bash
curl -X POST http://localhost:3000/api/tax \
  -H "Content-Type: application/json" \
  -d '{
    "grossIncome": 30000000,
    "dependents": 1,
    "insuranceRate": 10.5
  }'
```

**Example Request (JavaScript):**

```javascript
const response = await fetch('http://localhost:3000/api/tax', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    grossIncome: 30000000,
    dependents: 1,
    insuranceRate: 10.5,
  }),
});

const result = await response.json();
console.log(result.data);
```

**Example Request (Python):**

```python
import requests

response = requests.post(
    'http://localhost:3000/api/tax',
    json={
        'grossIncome': 30000000,
        'dependents': 1,
        'insuranceRate': 10.5
    }
)

result = response.json()
print(result['data'])
```

---

#### `GET /api/tax`

Calculate tax using query parameters (alternative to POST).

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `grossIncome` | number | Yes | Monthly gross income in VND |
| `dependents` | number | Yes | Number of dependents |
| `insuranceRate` | number | Yes | Insurance rate as percentage |

**Example Request:**

```bash
curl "http://localhost:3000/api/tax?grossIncome=30000000&dependents=1&insuranceRate=10.5"
```

**Response:** Same as POST endpoint

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input |
| 500 | Internal Server Error |

---

## Rate Limiting

Currently no rate limiting is implemented. For production use, consider:
- Implementing rate limiting middleware
- Using API keys for authentication
- Monitoring usage patterns

---

## CORS

CORS is not configured by default. To enable for external access:

```javascript
// src/app/api/tax/route.ts
export async function POST(request: NextRequest) {
  const response = NextResponse.json(data);
  
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  
  return response;
}
```

---

## Examples by Use Case

### 1. Single Person, No Dependents

**Request:**
```json
{
  "grossIncome": 15000000,
  "dependents": 0,
  "insuranceRate": 10.5
}
```

**Result:**
- Taxable Income: ≈2.4M VND
- Tax: ≈120K VND (5% bracket)
- Net Income: ≈13.3M VND

### 2. Family with 2 Dependents

**Request:**
```json
{
  "grossIncome": 30000000,
  "dependents": 2,
  "insuranceRate": 10.5
}
```

**Result:**
- Taxable Income: ≈4.7M VND
- Tax: ≈235K VND (5% bracket)
- Net Income: ≈26.6M VND

### 3. High Income

**Request:**
```json
{
  "grossIncome": 100000000,
  "dependents": 0,
  "insuranceRate": 10.5
}
```

**Result:**
- Taxable Income: ≈78.5M VND
- Tax: ≈18.8M VND (multiple brackets)
- Net Income: ≈70.7M VND

---

## Integration Examples

### React/Next.js

```typescript
import { useState } from 'react';

function TaxCalculator() {
  const [result, setResult] = useState(null);

  const calculate = async (grossIncome: number, dependents: number) => {
    const response = await fetch('/api/tax', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grossIncome,
        dependents,
        insuranceRate: 10.5,
      }),
    });
    
    const data = await response.json();
    setResult(data.data);
  };

  return (
    // Your component JSX
  );
}
```

### Node.js Backend

```javascript
const axios = require('axios');

async function calculateTax(income, dependents) {
  try {
    const { data } = await axios.post('http://localhost:3000/api/tax', {
      grossIncome: income,
      dependents: dependents,
      insuranceRate: 10.5,
    });
    
    return data.data;
  } catch (error) {
    console.error('Tax calculation error:', error);
    throw error;
  }
}
```

### Mobile App (React Native)

```javascript
async function fetchTax(income, dependents) {
  try {
    const response = await fetch('https://your-api.com/api/tax', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grossIncome: income,
        dependents: dependents,
        insuranceRate: 10.5,
      }),
    });
    
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error(error);
  }
}
```

---

## Validation Rules

### grossIncome
- Type: Number
- Minimum: 0
- Maximum: No limit
- Must be non-negative integer or float

### dependents
- Type: Integer
- Minimum: 0
- Maximum: No hard limit (reasonable: 0-20)
- Must be whole number

### insuranceRate
- Type: Number
- Minimum: 0
- Maximum: 100
- Default: 10.5
- Represents percentage (10.5 = 10.5%)

---

## Error Handling

### Client-Side

```javascript
try {
  const response = await fetch('/api/tax', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    console.error('Validation error:', error.details);
    // Handle error
  }
  
  const result = await response.json();
  // Use result
} catch (error) {
  console.error('Network error:', error);
  // Handle network error
}
```

---

## Performance

- Average response time: < 50ms
- Calculations are synchronous
- No database queries
- Pure computational logic

---

## Future Enhancements

Planned API features:
- [ ] Batch calculations
- [ ] Historical tax data
- [ ] Year-over-year comparison
- [ ] Tax optimization suggestions
- [ ] Multiple calculation methods
- [ ] Export formats (PDF, CSV)

---

## Support

For API issues:
- Check this documentation
- Review example code
- Open GitHub issue
- Contact maintainers

---

## Version History

- **v1.0.0** - Initial API release
  - POST /api/tax
  - GET /api/tax
  - Zod validation
  - Error handling
