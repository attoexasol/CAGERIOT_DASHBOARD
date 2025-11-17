'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { SearchBar } from '../../../components/SearchBar';
import { ButtonPrimary } from '../../../components/ButtonPrimary';
import { VideoPlayer } from '../../../components/VideoPlayer';
import { SEO } from '../../../components/SEO';

const videos = [
  {
    id: '1',
    title: 'Witching Hour - Official Music Video',
    artist: 'Grace Power',
    views: '2.4M',
    duration: '3:45',
    thumbnail: 'https://images.unsplash.com/photo-1644855640845-ab57a047320e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
  {
    id: '2',
    title: 'Hand On The Bible - Lyric Video',
    artist: 'Grace Power',
    views: '1.8M',
    duration: '4:12',
    thumbnail: 'https://images.unsplash.com/photo-1671786390055-13842b30e424?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  },
  {
    id: '3',
    title: 'Midnight Dreams - Live Session',
    artist: 'Echo Chamber',
    views: '956K',
    duration: '5:30',
    thumbnail: 'https://images.unsplash.com/photo-1596807323443-a1528e2cd0ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  },
  {
    id: '4',
    title: 'Time After Time - Acoustic Version',
    artist: 'Grace Power',
    views: '1.2M',
    duration: '4:20',
    thumbnail: 'https://images.unsplash.com/photo-1646500366920-b4c5ce29237d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  },
  {
    id: '5',
    title: 'Electric Soul - Behind The Scenes',
    artist: 'The Resonance',
    views: '780K',
    duration: '6:15',
    thumbnail: 'https://images.unsplash.com/photo-1512153129600-528cae82b06a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  },
  {
    id: '6',
    title: 'Lost In The Echo - Studio Session',
    artist: 'Digital Waves',
    views: '1.5M',
    duration: '5:45',
    thumbnail: 'https://images.unsplash.com/photo-1669546164343-d89ffdd1017f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  },
];

export default function Videos() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      <SEO
        title="Videos"
        description="Manage music videos, lyric videos, and live sessions"
        keywords="music videos, lyric videos, live sessions, video content"
      />
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl text-white">Videos</h1>
        <ButtonPrimary icon={Plus} href="/videos/new">Add Video</ButtonPrimary>
      </div>

      <div className="mb-6">
        <SearchBar placeholder="Search videos..." value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <div key={video.id}>
            <VideoPlayer
              videoUrl={video.videoUrl}
              thumbnail={video.thumbnail}
              title={video.title}
            />
            <div className="mt-3">
              <h3 className="text-white">{video.title}</h3>
              <p className="text-sm text-gray-400">{video.artist}</p>
              <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                <span>{video.views} views</span>
                <span>•</span>
                <span>{video.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
