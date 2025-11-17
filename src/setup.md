# Cage Riot - Setup Instructions

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

### 3. Choose Your Mode

#### Option A: Demo Mode (Recommended for Testing)

Keep the default `.env` settings:

```env
VITE_USE_LIVE_API=false
```

**Demo Login:**
- Email: `demo@cageriot.com`
- Password: `demo123`

#### Option B: Live API Mode

Update `.env` with your API details:

```env
VITE_USE_LIVE_API=true
VITE_API_BASE_URL=https://api.yourdomain.com/v1
VITE_API_KEY=your_api_key_here
```

### 4. Start Development Server

```bash
npm run dev
```

The application will open at `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## 📋 Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created and configured
- [ ] API mode selected (demo or live)
- [ ] Development server running
- [ ] Application accessible at http://localhost:3000

## 🔧 Configuration Options

| Setting | Demo Mode | Live Mode |
|---------|-----------|-----------|
| `VITE_USE_LIVE_API` | `false` | `true` |
| `VITE_API_BASE_URL` | (ignored) | Your API URL |
| `VITE_API_KEY` | (ignored) | Your API key |
| `VITE_API_TIMEOUT` | 30000 | 30000 (adjustable) |

## 📚 Next Steps

- Read [API_INTEGRATION.md](./API_INTEGRATION.md) for complete API documentation
- Check [README.md](./README.md) for feature overview
- Review [guidelines/Guidelines.md](./guidelines/Guidelines.md) for development guidelines

## 🐛 Troubleshooting

### Issue: Environment variables not loading

**Solution:** Make sure your `.env` file is in the root directory and restart the dev server.

### Issue: "Cannot read properties of undefined"

**Solution:** Ensure all environment variables start with `VITE_` prefix.

### Issue: API requests failing in demo mode

**Solution:** This is expected - demo mode uses mock data, not real API calls.

## 💡 Tips

- Use **Demo Mode** for development and testing without a backend
- Use **Live Mode** when your API is ready and deployed
- Keep your `.env` file secure and never commit it to version control
- Use different `.env` files for different environments (dev, staging, production)

## 🆘 Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your `.env` configuration
3. Ensure dependencies are installed correctly
4. Review the [API_INTEGRATION.md](./API_INTEGRATION.md) guide
