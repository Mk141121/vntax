# Deployment Guide

This guide covers various deployment options for the Vietnam Tax Calculator.

## 🚀 Quick Deploy

### Vercel (Recommended)

The easiest way to deploy this Next.js application is with [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository on Vercel
3. Vercel will automatically detect Next.js and configure everything
4. Click "Deploy"

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Deploy

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build -t vietnam-tax-calculator .
```

### Run Container

```bash
docker run -p 3000:3000 vietnam-tax-calculator
```

### Docker Compose

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
```

## 🖥️ Self-Hosted Deployment

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Steps

1. Clone and install:
```bash
git clone <repository-url>
cd vietnam-tax-calculator
npm install
```

2. Build for production:
```bash
npm run build
```

3. Start production server:
```bash
npm start
```

The app will be available at `http://localhost:3000`

### Using PM2 (Process Manager)

1. Install PM2:
```bash
npm install -g pm2
```

2. Start app:
```bash
pm2 start npm --name "tax-calculator" -- start
```

3. Save PM2 configuration:
```bash
pm2 save
pm2 startup
```

### Nginx Reverse Proxy

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## ☁️ Cloud Platform Deployments

### AWS (Elastic Beanstalk)

1. Install AWS CLI and EB CLI
2. Initialize EB:
```bash
eb init
```

3. Create environment:
```bash
eb create vietnam-tax-calculator
```

4. Deploy:
```bash
eb deploy
```

### Google Cloud (Cloud Run)

1. Build container:
```bash
gcloud builds submit --tag gcr.io/PROJECT-ID/vietnam-tax-calculator
```

2. Deploy:
```bash
gcloud run deploy vietnam-tax-calculator \
  --image gcr.io/PROJECT-ID/vietnam-tax-calculator \
  --platform managed \
  --region asia-southeast1
```

### Azure (App Service)

1. Create App Service
2. Configure deployment from GitHub
3. Set build command: `npm run build`
4. Deploy

## 🔧 Environment Variables

For production deployment, you may want to set:

```bash
NODE_ENV=production
PORT=3000
```

## 📊 Performance Optimization

### 1. Enable Compression

In `next.config.js`:
```javascript
module.exports = {
  compress: true,
}
```

### 2. Image Optimization

Images are automatically optimized by Next.js Image component.

### 3. CDN Setup

For static assets, consider using a CDN:
- Vercel automatically provides CDN
- For self-hosted, use Cloudflare or AWS CloudFront

## 🔒 Security Checklist

- [ ] Set secure headers in `next.config.js`
- [ ] Use HTTPS in production
- [ ] Keep dependencies updated
- [ ] Enable rate limiting for API routes
- [ ] Add CORS configuration if needed
- [ ] Remove development tools in production build

## 📈 Monitoring

### Vercel Analytics

Add to `app/layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Custom Analytics

Integrate with:
- Google Analytics
- Plausible
- Umami
- Fathom

## 🐛 Troubleshooting

### Build Fails

1. Clear cache:
```bash
rm -rf .next node_modules
npm install
npm run build
```

2. Check Node version (requires 18+)

### Port Already in Use

Change port:
```bash
PORT=3001 npm start
```

### Memory Issues

Increase Node memory:
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

`.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm test
      # Add deployment steps here
```

## 📞 Support

For deployment issues, please:
1. Check the [README.md](README.md)
2. Review Next.js deployment docs
3. Open an issue on GitHub

---

Happy Deploying! 🚀
