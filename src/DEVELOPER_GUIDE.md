# Developer Guide - Cage Riot

## 🎯 For Developers

This guide is for developers who want to understand the codebase, extend functionality, or contribute to the project.

---

## 📚 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [API Layer](#api-layer)
3. [Component Structure](#component-structure)
4. [State Management](#state-management)
5. [Styling Guide](#styling-guide)
6. [Adding New Features](#adding-new-features)
7. [Best Practices](#best-practices)
8. [Testing](#testing)
9. [Debugging](#debugging)

---

## Architecture Overview

### Technology Stack

```
┌─────────────────────────────────────┐
│         React 18 (UI Layer)         │
├─────────────────────────────────────┤
│    React Router (Client Routing)    │
├─────────────────────────────────────┤
│   Zustand (State Management)        │
├─────────────────────────────────────┤
│    Service Layer (API Calls)        │
├─────────────────────────────────────┤
│   API Client (HTTP Requests)        │
├─────────────────────────────────────┤
│   Demo Mode ←→ Live API Mode        │
└─────────────────────────────────────┘
```

### Data Flow

```
Component → Service → API Client → Demo Data / Live API
                                         ↓
Component ← Service ← API Client ← Response Data
```

---

## API Layer

### Structure

```
lib/api/
├── client.ts           # HTTP client (fetch wrapper)
├── demo-data.ts        # Mock data for demo mode
├── types.ts            # TypeScript interfaces
├── services/           # Service layer
│   ├── auth.service.ts
│   ├── releases.service.ts
│   └── ...
└── index.ts           # Exports
```

### Adding a New API Endpoint

#### 1. Define Types (`lib/api/types.ts`)

```typescript
export interface MyResource {
  id: string;
  name: string;
  createdAt: string;
}

export interface CreateMyResourceRequest {
  name: string;
}
```

#### 2. Add Demo Data (`lib/api/demo-data.ts`)

```typescript
export const demoMyResources: MyResource[] = [
  {
    id: '1',
    name: 'Example Resource',
    createdAt: new Date().toISOString(),
  },
];
```

#### 3. Create Service (`lib/api/services/myresource.service.ts`)

```typescript
import { apiClient, ApiResponse, PaginatedResponse } from '../client';
import { MyResource, CreateMyResourceRequest, ListParams } from '../types';
import { isDemoMode } from '../../config';
import { demoMyResources, simulateDelay } from '../demo-data';

export const myResourceService = {
  /**
   * Get all resources
   */
  async getAll(params?: ListParams): Promise<PaginatedResponse<MyResource>> {
    // Demo mode
    if (isDemoMode()) {
      await simulateDelay();
      
      let resources = [...demoMyResources];
      
      // Apply search
      if (params?.search) {
        const search = params.search.toLowerCase();
        resources = resources.filter(r => 
          r.name.toLowerCase().includes(search)
        );
      }
      
      // Apply pagination
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const start = (page - 1) * limit;
      const end = start + limit;
      
      return {
        data: resources.slice(start, end),
        pagination: {
          page,
          limit,
          total: resources.length,
          totalPages: Math.ceil(resources.length / limit),
        },
      };
    }

    // Live API mode
    return apiClient.get<PaginatedResponse<MyResource>>('/myresources', { params });
  },

  /**
   * Get by ID
   */
  async getById(id: string): Promise<MyResource> {
    if (isDemoMode()) {
      await simulateDelay();
      const resource = demoMyResources.find(r => r.id === id);
      if (!resource) throw new Error('Resource not found');
      return resource;
    }

    const response = await apiClient.get<ApiResponse<MyResource>>(`/myresources/${id}`);
    return response.data;
  },

  /**
   * Create new resource
   */
  async create(data: CreateMyResourceRequest): Promise<MyResource> {
    if (isDemoMode()) {
      await simulateDelay();
      const newResource: MyResource = {
        id: String(demoMyResources.length + 1),
        ...data,
        createdAt: new Date().toISOString(),
      };
      demoMyResources.push(newResource);
      return newResource;
    }

    const response = await apiClient.post<ApiResponse<MyResource>>('/myresources', data);
    return response.data;
  },
};
```

#### 4. Export Service (`lib/api/index.ts`)

```typescript
export { myResourceService } from './services/myresource.service';
```

#### 5. Use in Components

```typescript
import { myResourceService } from '../lib/api';

function MyComponent() {
  const [resources, setResources] = useState([]);
  
  useEffect(() => {
    async function loadData() {
      const { data } = await myResourceService.getAll();
      setResources(data);
    }
    loadData();
  }, []);
}
```

---

## Component Structure

### Page Components

Located in `app/` directory:

```typescript
// app/(dashboard)/myfeature/page.tsx
export default function MyFeaturePage() {
  return (
    <div className="p-6">
      <h1>My Feature</h1>
      {/* Content */}
    </div>
  );
}
```

### Reusable Components

Located in `components/` directory:

```typescript
// components/MyComponent.tsx
interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  return (
    <div>
      <h2>{title}</h2>
      <button onClick={onAction}>Action</button>
    </div>
  );
}
```

### UI Components

Use Shadcn/ui components from `components/ui/`:

```typescript
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Dialog } from './components/ui/dialog';
```

---

## State Management

### Zustand Store

Example authentication store (`hooks/useAuth.ts`):

```typescript
import { create } from 'zustand';
import { authService } from '../lib/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  
  login: async (credentials) => {
    const response = await authService.login(credentials);
    set({ user: response.user, isAuthenticated: true });
  },
  
  logout: async () => {
    await authService.logout();
    set({ user: null, isAuthenticated: false });
  },
}));
```

### Creating New Stores

```typescript
import { create } from 'zustand';

interface MyStore {
  items: Item[];
  addItem: (item: Item) => void;
  removeItem: (id: string) => void;
}

export const useMyStore = create<MyStore>((set) => ({
  items: [],
  
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  })),
  
  removeItem: (id) => set((state) => ({
    items: state.items.filter(i => i.id !== id)
  })),
}));
```

---

## Styling Guide

### Tailwind CSS Classes

**DO NOT use these classes** (configured in globals.css):
- Font sizes: `text-lg`, `text-xl`, etc.
- Font weights: `font-bold`, `font-semibold`, etc.
- Line heights: `leading-tight`, etc.

**USE these classes**:
- Layout: `flex`, `grid`, `gap-4`, etc.
- Spacing: `p-4`, `m-2`, `space-y-4`, etc.
- Colors: `bg-zinc-900`, `text-zinc-50`, `text-hotpink`, etc.
- Borders: `border`, `border-zinc-800`, `rounded-lg`, etc.

### Color System

```typescript
// Primary colors
bg-zinc-950     // Main background (#09090b)
bg-zinc-900     // Card background
bg-zinc-800     // Borders
text-zinc-50    // Primary text (#fafafa)
text-zinc-400   // Secondary text
bg-hotpink      // Accent color (#ff0050)
text-hotpink    // Accent text
```

### Typography

Configured in `styles/globals.css`:

```css
h1 { /* Poppins, 32px */ }
h2 { /* Poppins, 24px */ }
h3 { /* Poppins, 20px */ }
p  { /* Inter, 16px */ }
```

---

## Adding New Features

### Checklist

- [ ] Define TypeScript types in `lib/api/types.ts`
- [ ] Add demo data in `lib/api/demo-data.ts`
- [ ] Create service in `lib/api/services/`
- [ ] Export service from `lib/api/index.ts`
- [ ] Create page component in `app/`
- [ ] Add route to `App.tsx`
- [ ] Add navigation link to `Sidebar.tsx`
- [ ] Test in demo mode
- [ ] Test with live API (if available)
- [ ] Add TypeScript type checking
- [ ] Document API endpoints

### Example: Adding "Playlists" Feature

#### 1. Types
```typescript
// lib/api/types.ts
export interface Playlist {
  id: string;
  name: string;
  trackCount: number;
  createdAt: string;
}
```

#### 2. Demo Data
```typescript
// lib/api/demo-data.ts
export const demoPlaylists: Playlist[] = [
  { id: '1', name: 'Top Hits', trackCount: 25, createdAt: '2024-01-01' },
];
```

#### 3. Service
```typescript
// lib/api/services/playlists.service.ts
export const playlistsService = {
  async getAll() { /* ... */ },
  async create() { /* ... */ },
};
```

#### 4. Page
```typescript
// app/(dashboard)/playlists/page.tsx
export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState([]);
  // ... load and display playlists
}
```

#### 5. Route
```typescript
// App.tsx
<Route path="/playlists" element={<DashboardLayout><Playlists /></DashboardLayout>} />
```

#### 6. Navigation
```typescript
// components/Sidebar.tsx
{ path: '/playlists', label: 'Playlists', icon: List }
```

---

## Best Practices

### Code Style

```typescript
// ✅ Good: Type everything
interface Props {
  title: string;
  count: number;
}

// ❌ Bad: No types
function MyComponent(props) {
  // ...
}

// ✅ Good: Use services
import { releasesService } from '../lib/api';
const releases = await releasesService.getAll();

// ❌ Bad: Direct API calls
const response = await fetch('/api/releases');

// ✅ Good: Error handling
try {
  await myService.create(data);
} catch (error) {
  if (error instanceof ApiError) {
    console.error(error.message);
  }
}

// ❌ Bad: No error handling
await myService.create(data);
```

### Performance

```typescript
// ✅ Good: Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return calculateExpensive(data);
}, [data]);

// ✅ Good: Use callback for event handlers
const handleClick = useCallback(() => {
  doSomething();
}, []);

// ✅ Good: Lazy load routes (if needed)
const Playlists = lazy(() => import('./app/playlists/page'));
```

### Accessibility

```typescript
// ✅ Good: Proper labels
<button aria-label="Close dialog">×</button>

// ✅ Good: Semantic HTML
<nav>
  <ul>
    <li><a href="/releases">Releases</a></li>
  </ul>
</nav>

// ✅ Good: Keyboard navigation
<button onKeyDown={handleKeyDown}>Action</button>
```

---

## Testing

### Manual Testing Checklist

- [ ] Test in Demo Mode
- [ ] Test in Live API Mode
- [ ] Test authentication flow
- [ ] Test CRUD operations
- [ ] Test pagination
- [ ] Test search and filters
- [ ] Test file uploads
- [ ] Test error handling
- [ ] Test loading states
- [ ] Test responsive design
- [ ] Test keyboard navigation
- [ ] Test in different browsers

### Adding Unit Tests (Future)

```typescript
// Example with Vitest
import { describe, it, expect } from 'vitest';
import { myFunction } from './myModule';

describe('myFunction', () => {
  it('should return expected value', () => {
    expect(myFunction(input)).toBe(expected);
  });
});
```

---

## Debugging

### Console Logger

Use the built-in logger:

```typescript
import { logger } from './lib/logger';

logger.info('Loading releases...');
logger.success('Releases loaded successfully');
logger.error('Failed to load releases', error);
logger.api('Making API call to /releases');
```

### API Status Badge

In development mode, check the bottom-right corner for:
- Current mode (Demo/Live)
- API URL (if live)
- API key status

### Browser DevTools

1. **Network Tab**: Monitor API requests
2. **Console**: Check logger output
3. **React DevTools**: Inspect component state
4. **Redux DevTools**: Inspect Zustand stores (with middleware)

### Common Debug Points

```typescript
// Check current mode
import { isDemoMode } from './lib/config';
console.log('Demo mode:', isDemoMode());

// Check authentication
import { apiClient } from './lib/api';
console.log('Token:', apiClient.getToken());

// Check environment
console.log('Environment:', import.meta.env);
```

---

## Tips & Tricks

### Quick Environment Switch

```bash
# Switch to demo mode
echo "VITE_USE_LIVE_API=false" > .env

# Switch to live mode
echo "VITE_USE_LIVE_API=true" > .env
# (Then add API URL and key)
```

### Type Safety

```typescript
// Always import types
import type { Release, Artist } from './lib/api';

// Use type guards
if (error instanceof ApiError) {
  // TypeScript knows error is ApiError
}
```

### Reusable Patterns

```typescript
// Loading pattern
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

async function loadData() {
  setLoading(true);
  setError(null);
  try {
    const data = await service.getAll();
    setData(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}
```

---

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)
- [Vite](https://vitejs.dev)
- [Shadcn/ui](https://ui.shadcn.com)

---

**Happy Coding! 🎵**
