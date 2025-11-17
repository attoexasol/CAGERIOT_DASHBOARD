# Cage Riot - Quick Start Guide

## 🎯 Choose Your Mode

### Demo Mode (No Backend Required) ⚡

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

**Login with:**
- Email: `demo@cageriot.com`
- Password: `demo123`

✅ Perfect for: Testing, development, demos, UI/UX work

---

### Live API Mode (Production Ready) 🚀

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
npm run setup
# or manually: cp .env.example .env

# 3. Edit .env file
VITE_USE_LIVE_API=true
VITE_API_BASE_URL=https://api.yourdomain.com/v1
VITE_API_KEY=your_api_key_here

# 4. Start development server
npm run dev
```

✅ Perfect for: Production, staging, real data integration

---

## 🎨 What You Get

### ✅ Complete Dashboard UI
- Modern dark theme with hot-pink (#ff0050) accents
- Responsive design
- Professional music rights management interface

### ✅ Full Feature Set
- **Releases** - Album/EP/Single management with cover art
- **Artists** - Artist profiles and management
- **Tracks** - Track listings with metadata
- **Royalties** - Earnings and royalty tracking
- **Payouts** - Payment distribution management
- **Videos** - Video content with player
- **Performers** - Session musician management
- **Producers** - Production credits tracking
- **Writers** - Songwriter management
- **Publishers** - Publishing house management
- **Labels** - Record label management

### ✅ Developer Friendly
- TypeScript for type safety
- REST API ready (just add your backend)
- Modular, reusable components
- Clean, documented code
- Easy to customize and extend

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `.env` | API configuration |
| `API_INTEGRATION.md` | Complete API documentation |
| `lib/api/services/` | API service layer |
| `lib/config.ts` | Environment configuration |
| `components/` | Reusable UI components |
| `app/` | Page components |

---

## 🔄 Switching Modes

Edit `.env` and change one line:

```env
# Demo Mode
VITE_USE_LIVE_API=false

# Live Mode
VITE_USE_LIVE_API=true
```

Then restart dev server (`npm run dev`)

---

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # Check TypeScript types
npm run setup        # Create .env file
npm run clean        # Clean build artifacts
```

---

## 🐛 Troubleshooting

### Environment variables not working?
1. Ensure `.env` file exists in root directory
2. All variables must start with `VITE_`
3. Restart dev server after changes

### Getting API errors?
- **Demo Mode**: This is normal - uses mock data
- **Live Mode**: Check your API URL and key in `.env`

### Can't login?
- **Demo Mode**: Use `demo@cageriot.com` / `demo123`
- **Live Mode**: Use your actual API credentials

---

## 📚 Documentation

- **API Integration**: [API_INTEGRATION.md](./API_INTEGRATION.md)
- **Setup Guide**: [setup.md](./setup.md)
- **Development Guidelines**: [guidelines/Guidelines.md](./guidelines/Guidelines.md)

---

## 🎯 Next Steps

1. ✅ Choose your mode (Demo or Live)
2. ✅ Configure `.env` file
3. ✅ Start development server
4. ✅ Build your music rights platform!

---

## 💡 Pro Tips

- Use **Demo Mode** while building your backend
- Switch to **Live Mode** when API is ready
- Check browser console for API mode indicator
- Look for the status badge in bottom-right (dev mode only)
- Keep `.env` out of version control (already in `.gitignore`)

---

**Questions?** Check the full documentation in [API_INTEGRATION.md](./API_INTEGRATION.md)
