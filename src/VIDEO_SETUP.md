# Hero Video Setup Instructions

## Video File Location
The login page expects a hero background video at:
```
/public/videos/hero-bg.mp4
```

## Download Instructions
1. Download the video from: https://drive.google.com/drive/folders/1F30RKhD2B3ixnxQHVnWRdRNxf4SB7AI_?usp=sharing
2. Place the video file in `/public/videos/` directory
3. Rename it to `hero-bg.mp4` if it has a different name

## Video Implementation
- The video only displays on desktop (screens ≥1024px width)
- Mobile devices show a gradient background instead
- Video is set to autoplay, loop, and mute for optimal UX
- Opacity is set to 50% with a dark gradient overlay for text readability

## Current Placeholder
A placeholder file has been created at `/public/videos/hero-bg.mp4` that should be replaced with the actual video file.

## Video Specifications
- Format: MP4
- Recommended settings:
  - Codec: H.264
  - Resolution: 1920x1080 or higher
  - File size: Optimized for web (under 10MB recommended)
  - Frame rate: 30fps
