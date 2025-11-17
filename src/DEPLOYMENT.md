# Deployment Guide

## 🚀 Production Deployment Checklist

### Pre-Deployment

- [ ] **Code Quality**
  - [ ] Run type check: `npm run type-check`
  - [ ] Fix all TypeScript errors
  - [ ] Test all features in demo mode
  - [ ] Test all features with live API (if available)
  - [ ] Verify all pages load correctly
  - [ ] Test responsive design on different devices

- [ ] **Environment Configuration**
  - [ ] Create production `.env` file
  - [ ] Set `VITE_USE_LIVE_API=true`
  - [ ] Configure production API URL
  - [ ] Add production API key
  - [ ] Remove any debug flags

- [ ] **API Backend**
  - [ ] All required endpoints implemented
  - [ ] CORS configured for frontend domain
  - [ ] Authentication working
  - [ ] File uploads functional
  - [ ] Rate limiting configured
  - [ ] Error responses standardized
  - [ ] SSL certificate installed

- [ ] **Security**
  - [ ] Environment variables not committed
  - [ ] API keys rotated for production
  - [ ] HTTPS enabled
  - [ ] Security headers configured
  - [ ] XSS protection enabled
  - [ ] CSRF protection enabled (if needed)

---

## 📦 Build Process

### 1. Clean Build
```bash
npm run clean
npm install
```

### 2. Set Production Environment
Create `.env.production`:
```env
VITE_USE_LIVE_API=true
VITE_API_BASE_URL=https://api.yourdomain.com/v1
VITE_API_KEY=your_production_api_key
VITE_API_TIMEOUT=30000
```

### 3. Build
```bash
npm run build
```

### 4. Test Build
```bash
npm run preview
```

### 5. Verify Output
- [ ] Check `dist/` folder exists
- [ ] Verify assets are optimized
- [ ] Check bundle size is reasonable
- [ ] Test in browser

---

## 🌐 Deployment Platforms

### Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Configure Environment Variables**
   - Go to Vercel dashboard
   - Add environment variables:
     - `VITE_USE_LIVE_API=true`
     - `VITE_API_BASE_URL=your_api_url`
     - `VITE_API_KEY=your_api_key`

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Initialize**
   ```bash
   netlify init
   ```

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Set Environment Variables**
   ```bash
   netlify env:set VITE_USE_LIVE_API true
   netlify env:set VITE_API_BASE_URL your_api_url
   netlify env:set VITE_API_KEY your_api_key
   ```

5. **Deploy**
   ```bash
   netlify deploy --prod
   ```

### AWS S3 + CloudFront

1. **Build Project**
   ```bash
   npm run build
   ```

2. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://your-bucket-name
   ```

3. **Configure for Static Hosting**
   ```bash
   aws s3 website s3://your-bucket-name --index-document index.html
   ```

4. **Upload Files**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name
   ```

5. **Create CloudFront Distribution**
   - Point to S3 bucket
   - Configure SSL certificate
   - Set cache policies

6. **Update Environment**
   - Store env variables in AWS Systems Manager
   - Use AWS Amplify for easier deployment

### Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   ARG VITE_USE_LIVE_API
   ARG VITE_API_BASE_URL
   ARG VITE_API_KEY
   ENV VITE_USE_LIVE_API=$VITE_USE_LIVE_API
   ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
   ENV VITE_API_KEY=$VITE_API_KEY
   RUN npm run build

   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Create nginx.conf**
   ```nginx
   server {
     listen 80;
     server_name localhost;
     root /usr/share/nginx/html;
     index index.html;
     
     location / {
       try_files $uri $uri/ /index.html;
     }
   }
   ```

3. **Build Image**
   ```bash
   docker build \
     --build-arg VITE_USE_LIVE_API=true \
     --build-arg VITE_API_BASE_URL=https://api.yourdomain.com/v1 \
     --build-arg VITE_API_KEY=your_key \
     -t cage-riot:latest .
   ```

4. **Run Container**
   ```bash
   docker run -p 80:80 cage-riot:latest
   ```

---

## 🔧 Post-Deployment

### Testing

- [ ] **Functionality**
  - [ ] Login works
  - [ ] All pages accessible
  - [ ] Data loads correctly
  - [ ] CRUD operations work
  - [ ] File uploads work
  - [ ] Navigation works
  - [ ] Search works
  - [ ] Filters work

- [ ] **Performance**
  - [ ] Page load time < 3 seconds
  - [ ] API response time acceptable
  - [ ] Images optimized
  - [ ] No console errors
  - [ ] No memory leaks

- [ ] **Cross-Browser**
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge

- [ ] **Mobile**
  - [ ] iOS Safari
  - [ ] Android Chrome
  - [ ] Responsive layout
  - [ ] Touch interactions

### Monitoring

1. **Set Up Analytics**
   ```typescript
   // Add to your analytics provider
   // Example: Google Analytics, Plausible, etc.
   ```

2. **Error Tracking**
   ```typescript
   // Add Sentry or similar
   import * as Sentry from "@sentry/react";
   
   Sentry.init({
     dsn: "your-sentry-dsn",
     environment: "production",
   });
   ```

3. **Performance Monitoring**
   - Set up Web Vitals tracking
   - Monitor API response times
   - Track user interactions

### Maintenance

- [ ] Set up automated deployments
- [ ] Configure staging environment
- [ ] Set up backup strategy
- [ ] Document deployment process
- [ ] Create rollback plan
- [ ] Schedule regular updates

---

## 🚨 Rollback Plan

### If Deployment Fails

1. **Immediate Actions**
   - Revert to previous deployment
   - Notify team
   - Check error logs

2. **On Vercel/Netlify**
   - Use platform UI to rollback to previous deployment
   - Or redeploy previous commit

3. **On AWS**
   - Switch CloudFront to previous S3 version
   - Or restore from backup

4. **On Docker**
   - Roll back to previous image tag
   - Restart containers

---

## 📊 Environment Variables Reference

### Required for Production

| Variable | Example | Description |
|----------|---------|-------------|
| `VITE_USE_LIVE_API` | `true` | Enable live API mode |
| `VITE_API_BASE_URL` | `https://api.example.com/v1` | Production API URL |
| `VITE_API_KEY` | `prod_key_xxxxx` | Production API key |

### Optional

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_TIMEOUT` | `30000` | Request timeout in ms |

---

## 🔐 Security Checklist

- [ ] HTTPS enabled
- [ ] API keys secured
- [ ] CORS properly configured
- [ ] CSP headers set
- [ ] XSS protection enabled
- [ ] No sensitive data in console
- [ ] No API keys in source code
- [ ] Environment variables not exposed
- [ ] Rate limiting on API
- [ ] Authentication tokens expire

---

## 📈 Performance Optimization

### Build Optimization

- [ ] Code splitting enabled
- [ ] Tree shaking working
- [ ] Minification enabled
- [ ] Gzip compression enabled
- [ ] Assets optimized

### Runtime Optimization

- [ ] Lazy loading components
- [ ] Image optimization
- [ ] CDN for static assets
- [ ] Caching strategy
- [ ] Service worker (if PWA)

---

## 🆘 Troubleshooting

### Build Fails

**Check:**
- Node version matches requirements
- All dependencies installed
- No TypeScript errors
- Environment variables set

**Solution:**
```bash
npm run clean
npm install
npm run type-check
npm run build
```

### Environment Variables Not Working

**Check:**
- Variables start with `VITE_`
- Values are set correctly
- Build was run after setting variables

**Solution:**
- Rebuild after changing environment variables
- Clear build cache
- Verify variable names

### API Requests Fail in Production

**Check:**
- API URL is correct
- CORS configured on API
- API key is valid
- SSL certificate valid

**Solution:**
- Test API directly with curl
- Check browser network tab
- Verify CORS headers
- Check API logs

### 404 on Refresh

**Solution:**
Add redirect rules for SPA:

**Vercel** (`vercel.json`):
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Netlify** (`netlify.toml`):
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Nginx**:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

---

## ✅ Final Checklist

Before going live:

- [ ] All tests passing
- [ ] Build successful
- [ ] Environment variables configured
- [ ] API backend ready
- [ ] CORS configured
- [ ] SSL certificate active
- [ ] Domain configured
- [ ] DNS propagated
- [ ] Error tracking setup
- [ ] Analytics setup
- [ ] Monitoring setup
- [ ] Documentation updated
- [ ] Team notified
- [ ] Rollback plan ready

---

## 🎉 Launch!

Once everything is checked:

1. Deploy to production
2. Monitor for 15-30 minutes
3. Test all critical paths
4. Notify stakeholders
5. Document any issues
6. Celebrate! 🎊

---

*For questions about deployment, refer to the hosting platform's documentation or contact your DevOps team.*
