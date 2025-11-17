# Responsive Design Guide

This document outlines the responsive design implementation across the Cage Riot music rights management dashboard.

## Breakpoints

We use Tailwind CSS's default breakpoints:
- **Mobile**: < 640px (default, no prefix)
- **Small (sm)**: ≥ 640px (tablets portrait)
- **Medium (md)**: ≥ 768px (tablets landscape)
- **Large (lg)**: ≥ 1024px (laptops/desktops)
- **XL (xl)**: ≥ 1280px (large desktops)

## Layout Components

### Sidebar (`/components/Sidebar.tsx`)
- **Desktop (lg+)**: Fixed sidebar, collapsible with toggle button
- **Mobile/Tablet (< lg)**: Hidden by default, slides in from left as overlay when hamburger menu is clicked
- Uses transform animations for smooth slide-in/out
- Dark overlay on mobile when menu is open

### Header (`/components/Header.tsx`)
- **Desktop**: Full search bar, all icons visible
- **Mobile**: Hamburger menu button on left, condensed layout
- **Responsive elements**:
  - Hamburger menu: Only visible on mobile (< lg)
  - "Impersonating" badge: Hidden on mobile (< md)
  - Dark mode toggle: Hidden on smallest screens (< sm)
  - Search bar: Responsive width (max-w-md)

### Dashboard Layout (`/app/(dashboard)/layout.tsx`)
- Mobile menu state management
- Overlay backdrop for mobile menu
- Flexible container that adapts to sidebar state

## Page Layouts

### Dashboard Page
- **Stats Grid**:
  - Mobile: 1 column
  - Tablet (sm+): 2 columns
  - Desktop (lg+): 4 columns
  
- **Recent Releases Grid**:
  - Mobile: 1 column
  - Tablet (sm+): 2 columns
  - Large tablet (lg+): 3 columns
  - Desktop (xl+): 4 columns

### List Pages (Artists, Tracks, etc.)

#### Table Display
- **Desktop (md+)**: Standard table with all columns
- **Mobile (< md)**: Converts to card layout with stacked information

#### Search & Filters
- Responsive search bar that adapts to container width
- Filters stack on mobile, inline on desktop
- View mode toggles (grid/list) hidden on mobile

### Releases Grid
- **Grid Layout**:
  - Mobile: 1 column
  - Tablet (sm+): 2 columns
  - Large tablet (lg+): 3 columns
  - Desktop (xl+): 4 columns

### Forms (Add/Edit Pages)
- Responsive padding: `p-4 md:p-6 lg:p-8`
- Form containers: max-width with responsive padding
- Labels and inputs adapt to smaller screens
- Two-column grids on larger screens become single column on mobile

## Typography

### Headings
- **Page Titles**: `text-2xl md:text-3xl`
- **Section Titles**: `text-lg md:text-xl`
- **Body Text**: `text-sm md:text-base`

### Spacing
- **Page Padding**: `p-4 md:p-6 lg:p-8`
- **Section Margins**: `mb-4 md:mb-6 lg:mb-8`
- **Gap Between Elements**: `gap-3 md:gap-4 lg:gap-6`

## Buttons

### Action Buttons
- Icon + Text on desktop
- Icon only or shortened text on mobile
- Example: "Add Artist" → "Add" on mobile

### Button Groups
- Stack vertically on mobile
- Horizontal on tablet+
- Responsive gaps between buttons

## Tables → Cards

Tables automatically convert to card layout on mobile (< md):

**Desktop Table** → **Mobile Card**
- Each row becomes a card
- Avatar/image displayed prominently
- Key information shown in grid layout
- Actions accessible via buttons
- Horizontal scrolling as fallback for complex tables

## Authentication Pages

### Login/Register/Forgot Password
- Centered card with responsive width
- Responsive padding: `p-6 md:p-8`
- Horizontal padding on container: `px-4` to prevent edge touching
- Vertical padding on register page: `py-8` to prevent top/bottom edge touching
- Form inputs stack properly on all screen sizes
- Logo and branding scale appropriately

## Mobile Optimizations

1. **Touch Targets**: All interactive elements meet minimum 44x44px touch target
2. **Reduced Padding**: Less padding on mobile to maximize content area
3. **Simplified Navigation**: Hamburger menu instead of persistent sidebar
4. **Condensed Headers**: Less prominent secondary elements
5. **Card-Based Layouts**: Tables convert to cards for better mobile UX
6. **Responsive Images**: All images scale appropriately
7. **Font Scaling**: Smaller base font sizes on mobile

## Testing Checklist

When adding new pages or components, ensure:
- [ ] Layout works on mobile (< 640px)
- [ ] Layout works on tablet (640px - 1023px)
- [ ] Layout works on desktop (1024px+)
- [ ] Text is readable on all screen sizes
- [ ] Touch targets are appropriately sized
- [ ] No horizontal scrolling (except intentional, like tables)
- [ ] Forms are usable on mobile
- [ ] Navigation works on all devices
- [ ] Images scale properly
- [ ] Content doesn't touch edges on small screens

## Common Patterns

### Flex Container with Responsive Direction
```tsx
<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
```

### Responsive Grid
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
```

### Responsive Text
```tsx
<h1 className="text-2xl md:text-3xl text-white">Title</h1>
```

### Responsive Padding
```tsx
<div className="p-4 md:p-6 lg:p-8">
```

### Hide on Mobile
```tsx
<div className="hidden md:block">Desktop only</div>
```

### Show on Mobile Only
```tsx
<div className="md:hidden">Mobile only</div>
```

## Browser Support

The application is optimized for:
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile Safari (iOS 12+)
- Chrome Mobile (Android 8+)

## Performance Considerations

- CSS-only animations for smooth performance
- Optimized images with appropriate sizing
- Lazy loading for off-screen content where applicable
- Minimal JavaScript for layout changes
- Use of CSS transforms for animations (GPU accelerated)
