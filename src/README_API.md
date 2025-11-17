# 🎵 Cage Riot - API Integration Complete

Your API integration is now ready! Here's everything you need to know.

## 📁 What's Been Set Up

### ✅ Core Infrastructure
- **API Configuration** (`/lib/config.ts`) - Centralized API_CONFIG with BASE_URL and API_KEY
- **API Helpers** (`/lib/api/helpers.ts`) - Clean functions for headers and responses
- **Environment Variables** (`.env`) - Easy configuration without code changes

### ✅ Services (All following your exact pattern)
All services use `fetch` with `async/await` and follow this pattern:

```typescript
const response = await fetch(`${API_CONFIG.BASE_URL}/endpoint`, {
  method: "POST",
  headers: getApiHeaders(true),
  body: JSON.stringify({ data: 'value' }),
});

const data = await handleApiResponse(response);
```

Services created:
- ✅ Authentication (`auth.service.ts`)
- ✅ Releases (`releases.service.ts`)
- ✅ Artists (`artists.service.ts`)
- ✅ Tracks (`tracks.service.ts`)
- ✅ Videos (`videos.service.ts`)
- ✅ Labels (`labels.service.ts`)
- ✅ Publishers (`publishers.service.ts`)
- ✅ Writers (`writers.service.ts`)
- ✅ Producers (`producers.service.ts`)
- ✅ Performers (`performers.service.ts`)
- ✅ Royalties (`royalties.service.ts`)
- ✅ Payouts (`payouts.service.ts`)
- ✅ Dashboard (`dashboard.service.ts`)
- ✅ Assets/Uploads (`assets.service.ts`)

### ✅ Documentation
- **Complete Guide**: `/API_INTEGRATION.md` - Full integration guide with examples
- **Quick Reference**: `/API_QUICK_REFERENCE.md` - Cheat sheet for developers
- **Example Service**: `/lib/api/services/_example.service.ts` - Copy-paste template

---

## 🚀 How to Use

### Step 1: Configure Your API

Edit `.env`:

```env
# Start with demo mode
VITE_USE_LIVE_API=false

# When ready, switch to live
VITE_USE_LIVE_API=true
VITE_API_BASE_URL=https://api.yourdomain.com/v1
VITE_API_KEY=your_actual_api_key
```

### Step 2: Test Demo Mode

```bash
npm run dev
```

Login with:
- **Email**: demo@cageriot.com
- **Password**: demo123

Test all features to ensure the app works correctly.

### Step 3: Connect Live API

Once your API is ready:

1. Update `.env` with live API URL and key
2. Set `VITE_USE_LIVE_API=true`
3. Restart the dev server
4. Test authentication
5. Verify all features work with live data

---

## 💡 Quick Examples

### Using Services in Components

```typescript
import { releasesService } from './lib/api';

function MyComponent() {
  const [releases, setReleases] = useState([]);

  useEffect(() => {
    async function fetchReleases() {
      try {
        const result = await releasesService.getAll({ page: 1, limit: 10 });
        setReleases(result.data);
      } catch (error) {
        console.error('Failed:', error);
      }
    }
    fetchReleases();
  }, []);

  return <div>{/* render releases */}</div>;
}
```

### Creating New Items

```typescript
const handleCreate = async () => {
  try {
    const newRelease = await releasesService.create({
      title: 'Album Title',
      artistId: 'artist-123',
      type: 'Album',
      releaseDate: '2024-01-01',
    });
    console.log('Created:', newRelease);
  } catch (error) {
    console.error('Failed:', error);
  }
};
```

### Uploading Files

```typescript
const handleUpload = async (file: File) => {
  try {
    const result = await assetsService.uploadAudio(file, {
      title: 'Track Title',
      artistId: 'artist-123',
    });
    console.log('Uploaded:', result);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

---

## 🔐 Authentication

The app automatically handles authentication:

- ✅ Token stored in localStorage
- ✅ Automatically included in all API requests
- ✅ Auto-redirect to login on 401 errors
- ✅ Token cleared on logout

You don't need to manually manage tokens!

```typescript
// Login
await authService.login('email@example.com', 'password');

// Get current user
const user = await authService.getCurrentUser();

// Logout
await authService.logout();
```

---

## 📝 API Endpoints Your Backend Needs

Your API should implement these endpoints:

### Authentication
- `POST /auth/login` - Login with email/password
- `POST /auth/register` - Register new user
- `POST /auth/logout` - Logout
- `GET /auth/me` - Get current user
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Password reset

### Resources (All follow same pattern)
- `GET /:resource` - List all (with pagination)
- `GET /:resource/:id` - Get by ID
- `POST /:resource` - Create
- `PUT /:resource/:id` - Update
- `DELETE /:resource/:id` - Delete

Resources: `releases`, `artists`, `tracks`, `videos`, `labels`, `publishers`, `writers`, `producers`, `performers`, `royalties`, `payouts`

### Special Endpoints
- `POST /assets/audio` - Upload audio file
- `POST /assets/video` - Upload video file
- `POST /assets/image` - Upload image
- `GET /dashboard` - Get dashboard statistics

---

## 🎯 Expected Request/Response Format

### Request (with body):
```typescript
{
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": "your_key",           // If configured
    "Authorization": "Bearer token..."  // For authenticated requests
  },
  body: JSON.stringify({
    // Your data
  })
}
```

### Response Format:
```json
{
  "data": { /* your data */ },
  "success": true,
  "message": "Success"
}
```

### Paginated Response:
```json
{
  "data": [ /* items */ ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

---

## 🧪 Testing

### Console Commands

Open browser console and run:

```javascript
// Test full connection
testApiConnection()

// Quick health check
quickHealthCheck()

// Validate config
validateApiConfig()
```

### Manual Testing

1. Test authentication (login/logout)
2. Test list operations (GET all)
3. Test get by ID (GET one)
4. Test create (POST)
5. Test update (PUT)
6. Test delete (DELETE)
7. Test file uploads
8. Check error handling

---

## 🐛 Debugging

### Enable Debug Mode

```env
VITE_DEBUG_MODE=true
```

Check console for:
- API request details
- Response status codes
- Error messages
- Performance metrics

### Common Issues

**CORS Errors:**
Your API needs these headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-API-Key
```

**401 Unauthorized:**
- Verify API key is correct
- Check token hasn't expired
- Ensure Authorization header is being sent

**Network Timeout:**
Increase timeout in `.env`:
```env
VITE_API_TIMEOUT=60000  # 60 seconds
```

---

## 📚 Documentation Files

1. **`/API_INTEGRATION.md`** - Complete integration guide
   - Full setup instructions
   - All API endpoints documented
   - Authentication flow
   - File upload guide
   - Error handling
   - Testing guide

2. **`/API_QUICK_REFERENCE.md`** - Developer cheat sheet
   - Quick code snippets
   - Common patterns
   - Import statements
   - Gotchas and tips

3. **`/lib/api/services/_example.service.ts`** - Template
   - Complete service example
   - All CRUD operations
   - File upload
   - Error handling
   - Copy-paste ready

---

## 🎓 Learning by Example

### See how it's done:

1. **Auth Service** (`/lib/api/services/auth.service.ts`)
   - Login/logout implementation
   - Token management
   - Error handling

2. **Releases Service** (`/lib/api/services/releases.service.ts`)
   - Full CRUD operations
   - Pagination
   - Search filtering

3. **Artists Service** (`/lib/api/services/artists.service.ts`)
   - Another complete CRUD example
   - Similar pattern to releases

All services follow the same pattern - learn one, know them all!

---

## ✨ Features

### Demo Mode
- ✅ Works without live API
- ✅ Mock data for all resources
- ✅ Simulated delays
- ✅ Full CRUD operations
- ✅ Perfect for development

### Live API Mode
- ✅ Real API calls
- ✅ Automatic authentication
- ✅ Error handling
- ✅ Retry logic available
- ✅ Token management

### Developer Experience
- ✅ TypeScript support
- ✅ Clean, readable code
- ✅ Consistent patterns
- ✅ Comprehensive docs
- ✅ Easy debugging

---

## 🔄 Switching Between Demo and Live

### Use Demo Mode For:
- Local development
- Testing UI changes
- Prototyping features
- Demo presentations

### Use Live Mode For:
- Real data testing
- Production deployment
- QA testing
- Client demos with real data

Switch anytime by changing one line in `.env`:
```env
VITE_USE_LIVE_API=true  # or false
```

---

## 📦 What's Included

```
lib/
├── config.ts                          # API_CONFIG, env variables
├── logger.ts                          # Logging utilities
└── api/
    ├── helpers.ts                     # getApiHeaders, handleApiResponse
    ├── types.ts                       # TypeScript types
    ├── demo-data.ts                   # Mock data for demo mode
    ├── test-connection.ts             # API testing utilities
    └── services/
        ├── _example.service.ts        # ⭐ Template for new services
        ├── auth.service.ts            # Authentication
        ├── releases.service.ts        # Releases CRUD
        ├── artists.service.ts         # Artists CRUD
        ├── tracks.service.ts          # Tracks CRUD
        ├── videos.service.ts          # Videos CRUD
        ├── labels.service.ts          # Labels CRUD
        ├── publishers.service.ts      # Publishers CRUD
        ├── writers.service.ts         # Writers CRUD
        ├── producers.service.ts       # Producers CRUD
        ├── performers.service.ts      # Performers CRUD
        ├── royalties.service.ts       # Royalties
        ├── payouts.service.ts         # Payouts
        ├── dashboard.service.ts       # Dashboard stats
        └── assets.service.ts          # File uploads
```

---

## ✅ Checklist

Before going live:

- [ ] API deployed and accessible
- [ ] CORS configured on your API
- [ ] All endpoints implemented
- [ ] Authentication working
- [ ] File uploads working (if needed)
- [ ] Updated `.env` with live URL and key
- [ ] Set `VITE_USE_LIVE_API=true`
- [ ] Tested all features
- [ ] Error handling verified
- [ ] Console shows no errors

---

## 🎉 You're Ready!

Everything is set up and ready to go. Just:

1. Configure your `.env` file
2. Test in demo mode
3. Connect your live API when ready
4. Deploy and launch!

**Questions?** Check the documentation:
- `/API_INTEGRATION.md` - Full guide
- `/API_QUICK_REFERENCE.md` - Quick reference
- `/lib/api/services/_example.service.ts` - Code examples

---

**Happy coding! 🎵**
