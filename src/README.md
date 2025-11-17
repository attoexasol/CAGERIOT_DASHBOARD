# Cage Riot - Music Rights Management Dashboard

A modern, production-ready music rights and asset management platform built with **React**, **TypeScript**, and **Tailwind CSS** with **dual-mode API integration** (Demo & Live).

---

## 🚀 Quick Start

### Demo Mode (No Backend Required)
```bash
npm install
npm run dev
# Login: demo@cageriot.com / demo123
```

### Live API Mode (Production)
```bash
npm install
npm run setup        # Creates .env file
# Edit .env with your API details
npm run dev
```

📚 **Full Setup Guide:** [QUICK_START.md](./QUICK_START.md)

---

## 🔌 API Integration - READY TO USE!

The project includes a **complete, production-ready API integration system** using `fetch` with `async/await`. Simply configure your `.env` file and you're ready to go!

### Quick Start
```env
VITE_USE_LIVE_API=false          # Set to true when ready
VITE_API_BASE_URL=https://api.yourdomain.com/v1
VITE_API_KEY=your_api_key_here
```

### 📚 Documentation
- **[README_API.md](./README_API.md)** - Complete API overview and setup
- **[API_INTEGRATION.md](./API_INTEGRATION.md)** - Full integration guide with all endpoints
- **[API_QUICK_REFERENCE.md](./API_QUICK_REFERENCE.md)** - Developer cheat sheet

### ✅ What's Included
- ✅ 14 complete API services (Auth, Releases, Artists, Tracks, Videos, etc.)
- ✅ Clean `fetch` + `async/await` pattern throughout
- ✅ Automatic authentication with JWT tokens
- ✅ File upload support (audio, video, images)
- ✅ Demo mode with mock data (no backend required)
- ✅ Live mode ready for production
- ✅ Comprehensive error handling
- ✅ Testing utilities in browser console

---

## ✨ Key Features

### 🔌 Dual-Mode API Integration
- ✅ **Demo Mode** - Full functionality with mock data (no backend required)
- ✅ **Live Mode** - Connect to your REST API with one config change
- ✅ Seamless switching via `.env` file
- ✅ Type-safe API client with TypeScript
- ✅ Comprehensive service layer for all resources
- ✅ File uploads (cover art, audio)
- ✅ Pagination, search, and filtering
- ✅ Error handling with custom error classes
- ✅ Request timeout protection
- ✅ Debug logging with colored console output

### 🎵 Complete Feature Set
- **Dashboard** - Overview with stats, charts, and recent activity
- **Releases** - Album/EP/Single management with cover art
- **Artists** - Artist profiles and roster management
- **Tracks** - Individual track metadata and management
- **Videos** - Video content with embedded player
- **Performers** - Session musician tracking
- **Producers** - Production credits management
- **Writers** - Songwriter and publishing management
- **Publishers** - Publishing house management
- **Labels** - Record label management
- **Royalties** - Earnings and revenue tracking with charts
- **Payouts** - Payment distribution system
- **Settings** - User profile and preferences

### 🎨 Modern UI/UX
- Dark theme with hot-pink (#ff0050) accent color
- Fixed sidebar navigation with collapsible sections
- Top header with global search
- Responsive design for all screen sizes
- Professional typography (Inter/Poppins)
- Data tables with sorting and filtering
- Grid card layouts for visual content
- Interactive charts and graphs (Recharts)
- Toast notifications (Sonner)
- Modal dialogs for actions
- Loading states and skeletons
- Error boundaries

---

## 📁 Project Structure

```
cage-riot/
├── .env                    # Environment configuration (gitignored)
├── .env.example           # Environment template
├── App.tsx                # Main app with routing
├── app/                   # Page components
│   ├── page.tsx          # Login page
│   └── (dashboard)/      # Dashboard layout group
│       ├── layout.tsx    # Dashboard layout
│       ├── dashboard/    # Dashboard page
│       ├── releases/     # Releases pages
│       ├── artists/      # Artists pages
│       └── ...           # Other feature pages
├── components/           # Reusable components
│   ├── ui/              # Shadcn/ui components (40+)
│   ├── Sidebar.tsx      # Navigation sidebar
│   ├── Header.tsx       # Top header with search
│   ├── ApiStatus.tsx    # Dev mode API indicator
│   └── ...              # Other custom components
├── lib/                  # Utilities and services
│   ├── api/             # API integration layer
│   │   ├── client.ts    # HTTP client with auth
│   │   ├── demo-data.ts # Mock data for demo mode
│   │   ├── types.ts     # TypeScript type definitions
│   │   ├── services/    # API service layer
│   │   │   ├── auth.service.ts
│   │   │   ├── releases.service.ts
│   │   │   ├── artists.service.ts
│   │   │   ├── tracks.service.ts
│   │   │   ├── dashboard.service.ts
│   │   │   ├── royalties.service.ts
│   │   │   └── payouts.service.ts
│   │   └── index.ts     # Centralized exports
│   ├── config.ts        # Environment configuration
│   └── logger.ts        # Debug logging utility
├── hooks/               # Custom React hooks
│   └── useAuth.ts      # Authentication hook
├── styles/              # Global styles
│   └── globals.css     # Tailwind + custom styles
└── vite.config.ts      # Vite configuration
```

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm 9+
- Git

### 1. Install Dependencies
```bash
npm install
```

### 2. Choose Your Mode

#### Option A: Demo Mode (Recommended for Development)
```bash
# Default .env already configured for demo mode
npm run dev
```

**Demo Login:**
- Email: `demo@cageriot.com`
- Password: `demo123`

#### Option B: Live API Mode (Production)
```bash
# Create environment file
npm run setup

# Edit .env and configure:
VITE_USE_LIVE_API=true
VITE_API_BASE_URL=https://api.yourdomain.com/v1
VITE_API_KEY=your_api_key_here

# Start development
npm run dev
```

### 3. Open Browser
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔌 API Integration

### Configuration (.env)

```env
# API Mode
VITE_USE_LIVE_API=false          # Set to 'true' for live API

# Live API Settings (when VITE_USE_LIVE_API=true)
VITE_API_BASE_URL=https://api.yourdomain.com/v1
VITE_API_KEY=your_api_key_here
VITE_API_TIMEOUT=30000           # Request timeout in ms
```

### Using API Services

```typescript
import { releasesService, artistsService, authService } from './lib/api';

// Login
await authService.login({ email, password });

// Get releases
const { data, pagination } = await releasesService.getAll({
  page: 1,
  limit: 20,
  search: 'album'
});

// Create release
const release = await releasesService.create({
  title: 'New Album',
  artistId: '123',
  type: 'Album',
  releaseDate: '2024-12-01'
});

// Upload cover art
await releasesService.uploadCoverArt(releaseId, file);
```

### Available Services
- `authService` - Authentication & user management
- `releasesService` - Release CRUD operations
- `artistsService` - Artist management
- `tracksService` - Track management
- `dashboardService` - Dashboard statistics
- `royaltiesService` - Royalty records
- `payoutsService` - Payout management

📚 **Complete API Documentation:** [API_INTEGRATION.md](./API_INTEGRATION.md)

---

## 📦 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run type-check` | Check TypeScript types |
| `npm run setup` | Create .env file from template |
| `npm run clean` | Clean build artifacts |

---

## 🎨 Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI library |
| **TypeScript** | Type safety |
| **Vite** | Build tool & dev server |
| **React Router** | Client-side routing |
| **Tailwind CSS v4** | Utility-first styling |
| **Zustand** | State management |
| **Shadcn/ui** | Component library (40+ components) |
| **Recharts** | Data visualization |
| **Lucide React** | Icon library |
| **Sonner** | Toast notifications |

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [QUICK_START.md](./QUICK_START.md) | Fast setup guide |
| [API_INTEGRATION.md](./API_INTEGRATION.md) | Complete API documentation |
| [setup.md](./setup.md) | Detailed setup instructions |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Production deployment guide |
| [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | Comprehensive overview |
| [CHANGELOG.md](./CHANGELOG.md) | Version history |

---

## 🔐 Security

- ✅ Environment variables properly gitignored
- ✅ API key support with secure headers
- ✅ Token-based authentication
- ✅ Request timeout protection
- ✅ XSS protection via React
- ✅ Type-safe API calls

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

**Full Deployment Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🐛 Troubleshooting

### Environment Variables Not Loading
- Ensure `.env` file is in root directory
- Restart dev server after changes
- Verify variables start with `VITE_`

### API Requests Failing
- **Demo Mode**: Normal - uses mock data
- **Live Mode**: Check API URL and key in console

### Can't Login
- **Demo Mode**: Use `demo@cageriot.com` / `demo123`
- **Live Mode**: Use your actual API credentials

📖 **More Help:** [API_INTEGRATION.md - Troubleshooting](./API_INTEGRATION.md#troubleshooting)

---

## 🎯 Features Highlights

### Demo Mode Benefits
- ✅ No backend required
- ✅ Instant testing and development
- ✅ Full UI functionality
- ✅ Realistic mock data
- ✅ Perfect for frontend development

### Live Mode Benefits
- ✅ Connect to real API
- ✅ Production-ready
- ✅ Real-time data
- ✅ File uploads working
- ✅ Full CRUD operations

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **React** - UI library
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful component library
- **Recharts** - Charting library
- **Lucide** - Icon library

---

## 🆘 Support

- 📚 Check [API_INTEGRATION.md](./API_INTEGRATION.md) for API details
- 🚀 See [QUICK_START.md](./QUICK_START.md) for setup help
- 🐛 Review console logs (colored debug output)
- 💡 Look for API status badge (bottom-right in dev mode)

---

**Built with ❤️ for modern music rights management**

🎵 **Start managing your music rights today!**
