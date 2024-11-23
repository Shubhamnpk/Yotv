import { memo, useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import ReactPlayer from 'react-player/lazy';
import { isYouTubeUrl } from '../utils/streamUtils';

interface VideoPlayerProps {
  src: string;
  poster?: string;
}

function VideoPlayer({ src, poster }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!videoRef.current || isYouTubeUrl(src)) return;

    const video = videoRef.current;
    let hls: Hls | null = null;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    } else if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(src);
      hls.attachMedia(video);
    }

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  if (isYouTubeUrl(src)) {
    return (
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <ReactPlayer
          url={src}
          width="100%"
          height="100%"
          controls
          playing
          config={{
            youtube: {
              playerVars: { 
                showinfo: 1,
                modestbranding: 1,
                rel: 0
              }
            }
          }}
          onBuffer={() => setIsLoading(true)}
          onBufferEnd={() => setIsLoading(false)}
        />
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <video
        ref={videoRef}
        className="w-full aspect-video bg-black rounded-lg"
        controls
        poster={poster}
        playsInline
      />
    </>
  );
}

export default memo(VideoPlayer);