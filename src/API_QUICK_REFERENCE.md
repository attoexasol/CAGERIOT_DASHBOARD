# 🚀 API Quick Reference - Cage Riot

## Environment Setup

```env
VITE_USE_LIVE_API=false          # true for live API, false for demo
VITE_API_BASE_URL=https://api.yourdomain.com/v1
VITE_API_KEY=your_api_key_here
VITE_API_TIMEOUT=30000
```

---

## Import Helpers

```typescript
import { API_CONFIG } from './lib/config';
import { getApiHeaders, handleApiResponse, setAuthToken, getAuthToken } from './lib/api/helpers';
import { isDemoMode } from './lib/config';
import { logger } from './lib/logger';
```

---

## Standard API Call Pattern

```typescript
async function apiCall() {
  // Demo mode check
  if (isDemoMode()) {
    await simulateDelay();
    return { /* demo data */ };
  }

  // Live API
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/endpoint`, {
      method: 'POST',
      headers: getApiHeaders(true),  // true = include auth, false = no auth
      body: JSON.stringify({ data: 'value' }),
    });

    const data = await handleApiResponse(response);
    return data;
  } catch (error) {
    logger.error('API call failed:', error);
    throw error;
  }
}
```

---

## HTTP Methods

### GET
```typescript
const response = await fetch(`${API_CONFIG.BASE_URL}/items`, {
  method: 'GET',
  headers: getApiHeaders(true),
});
```

### POST
```typescript
const response = await fetch(`${API_CONFIG.BASE_URL}/items`, {
  method: 'POST',
  headers: getApiHeaders(true),
  body: JSON.stringify({ name: 'Item', value: 123 }),
});
```

### PUT
```typescript
const response = await fetch(`${API_CONFIG.BASE_URL}/items/${id}`, {
  method: 'PUT',
  headers: getApiHeaders(true),
  body: JSON.stringify({ name: 'Updated' }),
});
```

### DELETE
```typescript
const response = await fetch(`${API_CONFIG.BASE_URL}/items/${id}`, {
  method: 'DELETE',
  headers: getApiHeaders(true),
});
```

---

## File Upload

```typescript
const formData = new FormData();
formData.append('file', file);
formData.append('metadata', JSON.stringify({ title: 'Track' }));

const headers = {};
if (API_CONFIG.API_KEY) headers['X-API-Key'] = API_CONFIG.API_KEY;

const token = getAuthToken();
if (token) headers['Authorization'] = `Bearer ${token}`;

const response = await fetch(`${API_CONFIG.BASE_URL}/upload`, {
  method: 'POST',
  headers,  // DON'T include Content-Type for FormData
  body: formData,
});
```

---

## Query Parameters

```typescript
const params = new URLSearchParams({
  page: '1',
  limit: '10',
  search: 'query',
});

const response = await fetch(
  `${API_CONFIG.BASE_URL}/items?${params.toString()}`,
  {
    method: 'GET',
    headers: getApiHeaders(true),
  }
);
```

---

## Authentication

### Login
```typescript
import { authService } from './lib/api';

const result = await authService.login('email@example.com', 'password');
// Token automatically stored
```

### Logout
```typescript
await authService.logout();
// Token automatically cleared
```

### Get Current User
```typescript
const user = await authService.getCurrentUser();
```

### Manual Token Management
```typescript
import { setAuthToken, getAuthToken } from './lib/api/helpers';

// Set
setAuthToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');

// Get
const token = getAuthToken();

// Clear
setAuthToken(null);
```

---

## Service Usage

```typescript
import { releasesService, artistsService } from './lib/api';

// List
const result = await releasesService.getAll({ page: 1, limit: 10 });

// Get by ID
const release = await releasesService.getById('release-123');

// Create
const newRelease = await releasesService.create({
  title: 'Album Title',
  artistId: 'artist-123',
  type: 'Album',
  releaseDate: '2024-01-01',
});

// Update
const updated = await releasesService.update('release-123', {
  title: 'New Title',
});

// Delete
await releasesService.delete('release-123');
```

---

## Headers

### What `getApiHeaders(true)` returns:

```javascript
{
  'Content-Type': 'application/json',
  'X-API-Key': 'your_api_key',         // If configured
  'Authorization': 'Bearer token...'    // If includeAuth = true
}
```

### Without auth:
```typescript
getApiHeaders(false)
```

Returns:
```javascript
{
  'Content-Type': 'application/json',
  'X-API-Key': 'your_api_key',  // If configured
}
```

---

## Error Handling

```typescript
try {
  const data = await myService.getData();
} catch (error) {
  if (error.status === 401) {
    // Unauthorized - redirect to login
    // This is handled automatically by handleApiResponse
  } else if (error.status === 404) {
    // Not found
  } else if (error.status === 500) {
    // Server error
  }
  
  console.error('Error:', error.message);
  console.error('Status:', error.status);
  console.error('Data:', error.data);
}
```

---

## Demo Mode

### Check if demo mode:
```typescript
import { isDemoMode } from './lib/config';

if (isDemoMode()) {
  // Use mock data
  return demoData;
}
```

### Simulate delay:
```typescript
import { simulateDelay } from './lib/api/demo-data';

await simulateDelay();  // Default: 500ms
await simulateDelay(1000);  // Custom: 1000ms
```

---

## Available Services

| Service | Import | Description |
|---------|--------|-------------|
| Auth | `authService` | Login, logout, register |
| Releases | `releasesService` | Albums, singles, EPs |
| Artists | `artistsService` | Artist management |
| Tracks | `tracksService` | Track management |
| Videos | `videosService` | Video content |
| Labels | `labelsService` | Record labels |
| Publishers | `publishersService` | Music publishers |
| Writers | `writersService` | Songwriters |
| Producers | `producersService` | Producers & engineers |
| Performers | `performersService` | Session musicians |
| Royalties | `royaltiesService` | Royalty tracking |
| Payouts | `payoutsService` | Payout management |
| Dashboard | `dashboardService` | Dashboard stats |
| Assets | `assetsService` | File uploads |

---

## React Component Example

```typescript
import { useState, useEffect } from 'react';
import { releasesService } from './lib/api';

function MyComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const result = await releasesService.getAll();
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
}
```

---

## Console Debugging

Open browser console:

```javascript
// Test API connection
testApiConnection()

// Quick health check
quickHealthCheck()

// Validate configuration
validateApiConfig()

// Check current mode
console.log(API_CONFIG)
```

---

## Common Gotchas

❌ **DON'T** include Content-Type for FormData:
```typescript
// WRONG
const response = await fetch(url, {
  headers: {
    'Content-Type': 'multipart/form-data',  // ❌
  },
  body: formData,
});
```

✅ **DO** let browser set it:
```typescript
// CORRECT
const response = await fetch(url, {
  headers: {
    'Authorization': `Bearer ${token}`,  // ✅
  },
  body: formData,
});
```

---

❌ **DON'T** manually manage tokens in services:
```typescript
// WRONG
localStorage.setItem('token', token);  // ❌
```

✅ **DO** use helper functions:
```typescript
// CORRECT
setAuthToken(token);  // ✅
```

---

## File Locations

- **Example Service:** `/lib/api/services/_example.service.ts`
- **API Helpers:** `/lib/api/helpers.ts`
- **Configuration:** `/lib/config.ts`
- **Demo Data:** `/lib/api/demo-data.ts`

---

## Quick Checklist

- [ ] Update `.env` with API URL
- [ ] Add API key if required
- [ ] Set `VITE_USE_LIVE_API=true` when ready
- [ ] Test with demo mode first
- [ ] Verify authentication works
- [ ] Test each CRUD operation
- [ ] Check console for errors

---

**Need more details? Check `/API_INTEGRATION.md` for the complete guide.**
