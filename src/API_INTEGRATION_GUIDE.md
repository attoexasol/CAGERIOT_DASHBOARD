# 🔌 Cage Riot API Integration Guide

This guide will help you integrate your live API into the Cage Riot dashboard. The project is designed to seamlessly switch between demo mode and live API mode with minimal configuration.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Environment Configuration](#environment-configuration)
3. [API Endpoints Reference](#api-endpoints-reference)
4. [Authentication Flow](#authentication-flow)
5. [File Upload Integration](#file-upload-integration)
6. [Error Handling](#error-handling)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Step 1: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and configure your settings:
   ```env
   # Enable live API
   VITE_USE_LIVE_API=true
   
   # Your API base URL
   VITE_API_BASE_URL=https://api.yourdomain.com/v1
   
   # Your API key
   VITE_API_KEY=your_actual_api_key_here
   ```

### Step 2: Verify API Connection

The application will automatically validate your API configuration on startup. Check the browser console for:

```
🔗 Live API Mode: https://api.yourdomain.com/v1
✅ API Client initialized
```

### Step 3: Test Authentication

Try logging in with your API credentials. The app will make a request to:

```
POST /auth/login
```

If successful, you're ready to go!

---

## ⚙️ Environment Configuration

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_USE_LIVE_API` | Enable live API mode | `true` or `false` |
| `VITE_API_BASE_URL` | Your API base URL | `https://api.yourdomain.com/v1` |
| `VITE_API_KEY` | Your API authentication key | `sk_live_abc123...` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_TIMEOUT` | Request timeout in ms | `30000` |
| `VITE_MAX_UPLOAD_SIZE` | Max file size in MB | `100` |
| `VITE_DEBUG_MODE` | Enable debug logging | `true` |

### Feature Flags

```env
VITE_ENABLE_FILE_UPLOADS=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_REAL_TIME_SYNC=false
```

---

## 🌐 API Endpoints Reference

All API endpoints are documented below. The application expects these endpoints to be available on your API.

### Authentication

#### POST `/auth/login`
Login with email and password

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "admin",
      "company": "Music Label Inc"
    },
    "expiresIn": 86400
  }
}
```

#### POST `/auth/register`
Register a new user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "company": "Music Label Inc"
}
```

#### GET `/auth/me`
Get current user profile

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "admin"
  }
}
```

#### POST `/auth/logout`
Logout current user

#### POST `/auth/forgot-password`
Request password reset

**Request:**
```json
{
  "email": "user@example.com"
}
```

---

### Releases

#### GET `/releases`
List all releases

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `search` (string): Search query
- `sort` (string): Sort field
- `order` (string): 'asc' or 'desc'

**Response:**
```json
{
  "data": [
    {
      "id": "release_123",
      "title": "Album Title",
      "artist": "Artist Name",
      "artistId": "artist_123",
      "type": "Album",
      "releaseDate": "2024-06-15",
      "coverArt": "https://cdn.example.com/cover.jpg",
      "totalTracks": 12,
      "streams": 1250000,
      "revenue": 5234.50,
      "createdAt": "2024-06-01T00:00:00Z",
      "updatedAt": "2024-06-15T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

#### GET `/releases/:id`
Get release by ID

#### POST `/releases`
Create new release

**Request:**
```json
{
  "title": "Album Title",
  "artistId": "artist_123",
  "type": "Album",
  "releaseDate": "2024-06-15",
  "description": "Album description",
  "upc": "123456789012"
}
```

#### PUT `/releases/:id`
Update release

#### DELETE `/releases/:id`
Delete release

---

### Artists

#### GET `/artists`
List all artists

#### GET `/artists/:id`
Get artist by ID

#### POST `/artists`
Create new artist

**Request:**
```json
{
  "name": "Artist Name",
  "email": "artist@example.com",
  "role": "Primary Artist",
  "phone": "+1-555-0100",
  "bio": "Artist biography"
}
```

#### PUT `/artists/:id`
Update artist

#### DELETE `/artists/:id`
Delete artist

---

### Tracks

#### GET `/tracks`
List all tracks

#### GET `/tracks/:id`
Get track by ID

#### POST `/tracks`
Create new track

**Request:**
```json
{
  "title": "Track Title",
  "artistId": "artist_123",
  "releaseId": "release_123",
  "duration": "3:45",
  "isrc": "USRC12345678",
  "audioUrl": "https://cdn.example.com/track.mp3"
}
```

#### PUT `/tracks/:id`
Update track

#### DELETE `/tracks/:id`
Delete track

---

### Assets (File Uploads)

#### POST `/assets/audio`
Upload audio file

**Request:**
- Content-Type: `multipart/form-data`
- Field `file`: Audio file (mp3, wav, flac, aac)
- Field `metadata`: JSON string with additional data

**Response:**
```json
{
  "uploadId": "upload_abc123",
  "assetId": "asset_xyz789",
  "status": "processing",
  "url": "https://cdn.example.com/audio/track.mp3"
}
```

#### POST `/assets/video`
Upload video file

#### POST `/assets/image`
Upload image file

#### GET `/assets/:uploadId/status`
Check upload status

**Response:**
```json
{
  "assetId": "asset_xyz789",
  "status": "completed",
  "progress": 100,
  "url": "https://cdn.example.com/audio/track.mp3",
  "metadata": {
    "duration": "3:45",
    "size": 8437532,
    "format": "mp3",
    "bitrate": 320
  }
}
```

#### DELETE `/assets/:assetId`
Delete asset

---

### Videos

#### GET `/videos`
List all videos

#### POST `/videos`
Create new video entry

#### POST `/videos/:id/views`
Increment video view count

---

### Labels

#### GET `/labels`
List all record labels

#### POST `/labels`
Create new label

**Request:**
```json
{
  "name": "Label Name",
  "contact": "contact@label.com",
  "website": "https://label.com"
}
```

---

### Publishers

#### GET `/publishers`
List all publishers

#### POST `/publishers`
Create new publisher

**Request:**
```json
{
  "name": "Publisher Name",
  "territory": "Worldwide",
  "contact": "rights@publisher.com",
  "website": "https://publisher.com"
}
```

---

### Writers

#### GET `/writers`
List all writers/composers

#### POST `/writers`
Create new writer

**Request:**
```json
{
  "name": "Writer Name",
  "email": "writer@example.com",
  "ipiNumber": "00123456789",
  "publisherId": "publisher_123"
}
```

---

### Producers

#### GET `/producers`
List all producers

#### POST `/producers`
Create new producer

**Request:**
```json
{
  "name": "Producer Name",
  "role": "Producer",
  "email": "producer@example.com",
  "phone": "+1-555-0100"
}
```

**Available Roles:**
- Producer
- Audio Engineer
- Mixing Engineer
- Mastering Engineer

---

### Performers

#### GET `/performers`
List all performers

#### POST `/performers`
Create new performer

**Request:**
```json
{
  "name": "Performer Name",
  "instrument": "Guitar",
  "email": "performer@example.com",
  "phone": "+1-555-0100"
}
```

---

### Royalties

#### GET `/royalties`
List royalty records

#### GET `/royalties/stats`
Get royalty statistics

**Response:**
```json
{
  "total": 45000.00,
  "bySource": {
    "streaming": 32000.00,
    "mechanical": 8000.00,
    "performance": 3500.00,
    "sync": 1500.00
  },
  "monthlyBreakdown": [
    {
      "month": "2024-01",
      "streaming": 5200.00,
      "mechanical": 1200.00,
      "performance": 600.00
    }
  ]
}
```

---

### Payouts

#### GET `/payouts`
List payout records

#### POST `/payouts`
Create new payout

**Request:**
```json
{
  "collaboratorId": "artist_123",
  "collaboratorType": "artist",
  "amount": 2500.00,
  "period": "Q3 2024",
  "paymentMethod": "bank_transfer"
}
```

---

### Dashboard

#### GET `/dashboard`
Get dashboard statistics

**Response:**
```json
{
  "stats": {
    "totalReleases": 24,
    "totalArtists": 12,
    "totalTracks": 156,
    "totalRevenue": 45000.00,
    "monthlyRevenue": 8500.00,
    "totalStreams": 5420000
  },
  "recentReleases": [...],
  "topArtists": [...],
  "recentActivity": [...]
}
```

---

## 🔐 Authentication Flow

### How It Works

1. **Initial Login**
   - User submits credentials via login form
   - App sends POST request to `/auth/login`
   - API returns JWT token and user data
   - Token is stored in `localStorage` and memory

2. **Authenticated Requests**
   - All subsequent requests include token in headers:
     ```
     Authorization: Bearer {token}
     ```

3. **Token Management**
   - Token automatically added by `ApiClient`
   - Stored persistently in `localStorage`
   - Cleared on logout

4. **API Key (Optional)**
   - If your API requires an API key, it's sent as:
     ```
     X-API-Key: {your_api_key}
     ```

### Custom Authentication

If your API uses different authentication, modify `/lib/api/client.ts`:

```typescript
private getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Customize authentication here
  if (this.token) {
    headers['Authorization'] = `Bearer ${this.token}`;
    // Or use your custom header:
    // headers['X-Auth-Token'] = this.token;
  }

  return headers;
}
```

---

## 📤 File Upload Integration

### Upload Workflow

Based on your API screenshot, the upload process follows:

1. **Create Asset**
   - Call `/assets/audio`, `/assets/video`, or `/assets/image`
   - Receive `uploadId` in response

2. **Upload File**
   - Make PUT request to pre-signed URL (if using cloud storage)
   - Or send file directly in multipart form data

3. **Finalize**
   - Call `/assets/{uploadId}/finalize` if needed

4. **Check Status**
   - Poll `/assets/{uploadId}/status` to monitor processing

### Example Implementation

```typescript
import { assetsService } from './lib/api';

// Upload audio file
const handleAudioUpload = async (file: File) => {
  try {
    // Upload file
    const response = await assetsService.uploadAudio(file, {
      title: 'Track Title',
      artistId: 'artist_123',
      releaseId: 'release_123'
    });

    // Poll for completion
    const result = await assetsService.pollUntilComplete(
      response.uploadId,
      60,  // max attempts
      2000 // poll every 2 seconds
    );

    console.log('Upload complete:', result.url);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### File Type Validation

Configure in `.env`:

```env
# Supported audio formats
VITE_AUDIO_FILE_TYPES=audio/mpeg,audio/wav,audio/flac,audio/aac

# Supported video formats
VITE_VIDEO_FILE_TYPES=video/mp4,video/webm,video/quicktime

# Supported image formats
VITE_IMAGE_FILE_TYPES=image/jpeg,image/png,image/webp

# Max file size (MB)
VITE_MAX_UPLOAD_SIZE=100
```

---

## ⚠️ Error Handling

### Error Response Format

Your API should return errors in this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "INVALID_INPUT",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    }
  }
}
```

### HTTP Status Codes

The app handles these standard codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

### Custom Error Handling

Modify `/lib/api/client.ts` if your API uses different error formats:

```typescript
private async handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An error occurred',
    }));
    
    // Customize error handling here
    throw new ApiError(
      error.message || `HTTP ${response.status}`,
      response.status,
      error
    );
  }

  return response.json();
}
```

---

## 🧪 Testing

### Test Demo Mode

Before connecting to live API, test in demo mode:

```env
VITE_USE_LIVE_API=false
```

Demo credentials:
- Email: `demo@cageriot.com`
- Password: `demo123`

### Test Live API

1. Set `VITE_USE_LIVE_API=true`
2. Configure your API URL and key
3. Check browser console for connection status
4. Test each feature:
   - [ ] Login/Logout
   - [ ] View releases
   - [ ] Create release
   - [ ] Upload audio
   - [ ] View royalties
   - [ ] Process payout

### Debug Mode

Enable detailed logging:

```env
VITE_DEBUG_MODE=true
```

Check console for:
- API request/response logs
- Error details
- Performance metrics

---

## 🔧 Troubleshooting

### Issue: "API key not configured"

**Solution:** Set `VITE_API_KEY` in your `.env` file

### Issue: CORS errors

**Solution:** Your API must include these headers:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-API-Key
```

### Issue: Uploads fail

**Possible causes:**
1. File size exceeds `VITE_MAX_UPLOAD_SIZE`
2. File type not in `VITE_AUDIO_FILE_TYPES`
3. API endpoint not configured for multipart uploads

**Solution:** Check `.env` configuration and API logs

### Issue: Token expired errors

**Solution:** Your API should return 401 status. The app will redirect to login.

### Issue: Slow response times

**Adjust timeout:**
```env
VITE_API_TIMEOUT=60000  # 60 seconds
```

---

## 📚 Additional Resources

### File Locations

- **API Client:** `/lib/api/client.ts`
- **Services:** `/lib/api/services/`
- **Types:** `/lib/api/types.ts`
- **Config:** `/lib/config.ts`
- **Demo Data:** `/lib/api/demo-data.ts`

### Service Files

Each resource has its own service file:

- `auth.service.ts` - Authentication
- `releases.service.ts` - Releases
- `artists.service.ts` - Artists
- `tracks.service.ts` - Tracks
- `assets.service.ts` - File uploads
- `videos.service.ts` - Videos
- `labels.service.ts` - Labels
- `publishers.service.ts` - Publishers
- `writers.service.ts` - Writers
- `producers.service.ts` - Producers
- `performers.service.ts` - Performers
- `royalties.service.ts` - Royalties
- `payouts.service.ts` - Payouts
- `dashboard.service.ts` - Dashboard

### Modifying Services

To add custom endpoints, edit the relevant service file:

```typescript
// Example: Add custom endpoint to releases service
async getByGenre(genre: string): Promise<Release[]> {
  if (isDemoMode()) {
    // Return demo data
    return demoReleases.filter(r => r.genre === genre);
  }

  // Call live API
  const response = await apiClient.get<PaginatedResponse<Release>>(
    '/releases', 
    { params: { genre } }
  );
  return response.data;
}
```

---

## 🎯 Next Steps

1. ✅ Configure your `.env` file
2. ✅ Test demo mode to understand the app
3. ✅ Review API endpoints above
4. ✅ Ensure your API matches expected formats
5. ✅ Enable live mode and test thoroughly
6. ✅ Monitor console for any errors
7. ✅ Customize as needed for your use case

---

## 💬 Support

If you encounter issues:

1. Check browser console for detailed error messages
2. Verify `.env` configuration
3. Test API endpoints with tools like Postman
4. Review service files for customization needs

**The application is designed to be flexible - you can modify any service file to match your specific API requirements.**

---

**Happy integrating! 🎵**
