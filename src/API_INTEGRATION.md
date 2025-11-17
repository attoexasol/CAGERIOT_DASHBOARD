# 🔌 API Integration Guide - Cage Riot

## Quick Start

This project uses a simple, clean API integration pattern with `fetch` and `async/await`. Follow this guide to integrate your live API.

---

## 📝 Step 1: Configure Environment Variables

Edit your `.env` file:

```env
# Enable live API (set to true when ready)
VITE_USE_LIVE_API=false

# Your API base URL
VITE_API_BASE_URL=https://api.yourdomain.com/v1

# Your API key (if required)
VITE_API_KEY=your_api_key_here

# Request timeout (milliseconds)
VITE_API_TIMEOUT=30000
```

**Important:**
- Start with `VITE_USE_LIVE_API=false` to use demo mode
- Set to `true` when your API is ready
- Replace the URL and API key with your actual values

---

## 🏗️ API Pattern

All API calls follow this exact pattern:

```typescript
const handleLogin = async (emailArg: string, passwordArg: string) => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        ...getApiHeaders(false),
      },
      body: JSON.stringify({
        email: emailArg,
        password: passwordArg,
      }),
    });

    const data = await handleApiResponse(response);
    return data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};
```

### Key Components:

1. **API_CONFIG** - Configuration object with BASE_URL and API_KEY
2. **getApiHeaders()** - Helper to build headers with authentication
3. **handleApiResponse()** - Helper to parse and validate responses
4. **fetch with async/await** - Standard fetch API

---

## 🛠️ Available Helpers

### API Configuration

```typescript
import { API_CONFIG } from './lib/config';

console.log(API_CONFIG.BASE_URL);  // https://api.yourdomain.com/v1
console.log(API_CONFIG.API_KEY);   // your_api_key_here
```

### Headers Helper

```typescript
import { getApiHeaders } from './lib/api/helpers';

// Without authentication
const headers = getApiHeaders(false);

// With authentication (includes Bearer token)
const headers = getApiHeaders(true);
```

Returns:
```javascript
{
  'Content-Type': 'application/json',
  'X-API-Key': 'your_api_key',        // If configured
  'Authorization': 'Bearer token...'   // If includeAuth = true
}
```

### Response Handler

```typescript
import { handleApiResponse } from './lib/api/helpers';

const response = await fetch(url, options);
const data = await handleApiResponse(response);
```

Automatically:
- Checks if response is OK
- Parses JSON
- Throws errors with proper status codes
- Redirects to login on 401

### Token Management

```typescript
import { getAuthToken, setAuthToken } from './lib/api/helpers';

// Get token
const token = getAuthToken();

// Set token
setAuthToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');

// Clear token
setAuthToken(null);
```

---

## 📚 Complete Example - CRUD Operations

Here's a complete service file example:

```typescript
import { API_CONFIG } from '../../config';
import { isDemoMode } from '../../config';
import { logger } from '../../logger';
import { getApiHeaders, handleApiResponse } from '../helpers';
import { simulateDelay } from '../demo-data';

export const myService = {
  // GET - List all
  async getAll(page = 1, limit = 10) {
    if (isDemoMode()) {
      await simulateDelay();
      return { data: [], pagination: { page, limit, total: 0 } };
    }

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/items?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: getApiHeaders(true),
        }
      );

      return await handleApiResponse(response);
    } catch (error) {
      logger.error('Get all failed:', error);
      throw error;
    }
  },

  // GET - Get by ID
  async getById(id) {
    if (isDemoMode()) {
      await simulateDelay();
      return { id, name: 'Demo Item' };
    }

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/items/${id}`,
        {
          method: 'GET',
          headers: getApiHeaders(true),
        }
      );

      return await handleApiResponse(response);
    } catch (error) {
      logger.error(`Get ${id} failed:`, error);
      throw error;
    }
  },

  // POST - Create
  async create(data) {
    if (isDemoMode()) {
      await simulateDelay();
      return { id: 'demo-' + Date.now(), ...data };
    }

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/items`,
        {
          method: 'POST',
          headers: getApiHeaders(true),
          body: JSON.stringify(data),
        }
      );

      return await handleApiResponse(response);
    } catch (error) {
      logger.error('Create failed:', error);
      throw error;
    }
  },

  // PUT - Update
  async update(id, data) {
    if (isDemoMode()) {
      await simulateDelay();
      return { id, ...data };
    }

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/items/${id}`,
        {
          method: 'PUT',
          headers: getApiHeaders(true),
          body: JSON.stringify(data),
        }
      );

      return await handleApiResponse(response);
    } catch (error) {
      logger.error(`Update ${id} failed:`, error);
      throw error;
    }
  },

  // DELETE
  async delete(id) {
    if (isDemoMode()) {
      await simulateDelay();
      return;
    }

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/items/${id}`,
        {
          method: 'DELETE',
          headers: getApiHeaders(true),
        }
      );

      await handleApiResponse(response);
    } catch (error) {
      logger.error(`Delete ${id} failed:`, error);
      throw error;
    }
  },
};
```

---

## 📁 File Structure

```
lib/
├── config.ts              # API_CONFIG, environment variables
├── logger.ts              # Logging utilities
└── api/
    ├── helpers.ts         # getApiHeaders, handleApiResponse, etc.
    ├── types.ts           # TypeScript types
    ├── demo-data.ts       # Mock data for demo mode
    ├── index.ts           # Export all services
    └── services/
        ├── _example.service.ts    # Complete example service
        ├── auth.service.ts        # Authentication
        ├── releases.service.ts    # Releases CRUD
        ├── artists.service.ts     # Artists CRUD
        ├── tracks.service.ts      # Tracks CRUD
        ├── videos.service.ts      # Videos CRUD
        ├── labels.service.ts      # Labels CRUD
        ├── publishers.service.ts  # Publishers CRUD
        ├── writers.service.ts     # Writers CRUD
        ├── producers.service.ts   # Producers CRUD
        ├── performers.service.ts  # Performers CRUD
        ├── royalties.service.ts   # Royalties
        ├── payouts.service.ts     # Payouts
        ├── dashboard.service.ts   # Dashboard stats
        └── assets.service.ts      # File uploads
```

---

## 🔐 Authentication Flow

### 1. Login

```typescript
import { authService } from './lib/api';

const handleLogin = async (email, password) => {
  try {
    const response = await authService.login(email, password);
    // Token is automatically stored in localStorage
    console.log('Logged in:', response.user);
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### 2. Make Authenticated Requests

```typescript
// Token is automatically included in headers
const releases = await releasesService.getAll();
```

### 3. Logout

```typescript
await authService.logout();
// Token is automatically cleared
```

---

## 📤 File Uploads

For multipart/form-data uploads:

```typescript
const handleUpload = async (file) => {
  if (isDemoMode()) {
    await simulateDelay();
    return { uploadId: 'demo', status: 'completed' };
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', 'My Track');

    const headers = {};
    
    if (API_CONFIG.API_KEY) {
      headers['X-API-Key'] = API_CONFIG.API_KEY;
    }
    
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${API_CONFIG.BASE_URL}/assets/audio`,
      {
        method: 'POST',
        headers,
        body: formData,
      }
    );

    return await handleApiResponse(response);
  } catch (error) {
    logger.error('Upload failed:', error);
    throw error;
  }
};
```

**Note:** Don't include `Content-Type` header for FormData - browser sets it automatically with boundary.

---

## 🎯 API Endpoints

Your API should implement these endpoints:

### Authentication
- `POST /auth/login` - Login
- `POST /auth/register` - Register
- `POST /auth/logout` - Logout
- `GET /auth/me` - Get current user
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password

### Releases
- `GET /releases` - List releases
- `GET /releases/:id` - Get release
- `POST /releases` - Create release
- `PUT /releases/:id` - Update release
- `DELETE /releases/:id` - Delete release

### Artists
- `GET /artists` - List artists
- `GET /artists/:id` - Get artist
- `POST /artists` - Create artist
- `PUT /artists/:id` - Update artist
- `DELETE /artists/:id` - Delete artist

### Tracks
- `GET /tracks` - List tracks
- `GET /tracks/:id` - Get track
- `POST /tracks` - Create track
- `PUT /tracks/:id` - Update track
- `DELETE /tracks/:id` - Delete track

### Videos
- `GET /videos` - List videos
- `GET /videos/:id` - Get video
- `POST /videos` - Create video
- `PUT /videos/:id` - Update video
- `DELETE /videos/:id` - Delete video

### Assets (Uploads)
- `POST /assets/audio` - Upload audio file
- `POST /assets/video` - Upload video file
- `POST /assets/image` - Upload image
- `GET /assets/:id/status` - Check upload status
- `DELETE /assets/:id` - Delete asset

### Labels, Publishers, Writers, Producers, Performers
All follow the same pattern:
- `GET /:resource` - List all
- `GET /:resource/:id` - Get by ID
- `POST /:resource` - Create
- `PUT /:resource/:id` - Update
- `DELETE /:resource/:id` - Delete

### Royalties & Payouts
- `GET /royalties` - List royalties
- `GET /royalties/stats` - Get stats
- `GET /payouts` - List payouts
- `POST /payouts` - Create payout

### Dashboard
- `GET /dashboard` - Get dashboard data

---

## 📊 Expected Response Format

All endpoints should return this format:

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": { ... }
  }
}
```

**Paginated:**
```json
{
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

## ✅ Testing Your API

### 1. Test Demo Mode First

```env
VITE_USE_LIVE_API=false
```

Login with:
- Email: `demo@cageriot.com`
- Password: `demo123`

### 2. Test Live API

```env
VITE_USE_LIVE_API=true
VITE_API_BASE_URL=https://your-api.com/v1
VITE_API_KEY=your_key_here
```

### 3. Console Testing

Open browser console and run:

```javascript
// Test connection
testApiConnection()

// Quick health check
quickHealthCheck()

// Validate config
validateApiConfig()
```

---

## 🔍 Debugging

### Enable Debug Mode

```env
VITE_DEBUG_MODE=true
```

### Check Console Logs

All API calls are logged with:
- Request URL
- Request method
- Response status
- Errors

Look for:
```
🎵 API call: GET /releases
✅ Success: 200
❌ Error: 401 Unauthorized
```

### Common Issues

**CORS Errors:**
Your API must include:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-API-Key
```

**401 Unauthorized:**
- Check if token is expired
- Verify API key is correct
- Ensure token is being sent in headers

**Network Timeout:**
Increase timeout:
```env
VITE_API_TIMEOUT=60000
```

---

## 📖 Usage in Components

```typescript
import { releasesService, authService } from './lib/api';

function MyComponent() {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReleases = async () => {
    setLoading(true);
    try {
      const result = await releasesService.getAll({ page: 1, limit: 10 });
      setReleases(result.data);
    } catch (error) {
      console.error('Failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReleases();
  }, []);

  return (
    <div>
      {loading ? 'Loading...' : releases.map(r => <div key={r.id}>{r.title}</div>)}
    </div>
  );
}
```

---

## 🚀 Going Live

1. ✅ Test all features in demo mode
2. ✅ Ensure your API is deployed and accessible
3. ✅ Update `.env` with live API URL and key
4. ✅ Set `VITE_USE_LIVE_API=true`
5. ✅ Test authentication
6. ✅ Test each CRUD operation
7. ✅ Test file uploads
8. ✅ Monitor console for errors
9. ✅ Verify data is being saved/retrieved correctly

---

## 📞 Reference Files

- **Complete Example:** `/lib/api/services/_example.service.ts`
- **Auth Service:** `/lib/api/services/auth.service.ts`
- **Releases Service:** `/lib/api/services/releases.service.ts`
- **Artists Service:** `/lib/api/services/artists.service.ts`
- **API Helpers:** `/lib/api/helpers.ts`
- **Configuration:** `/lib/config.ts`

---

**That's it! Your API integration is ready to go. Just plug in your API URL and key when you're ready! 🎵**
