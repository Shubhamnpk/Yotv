export const isValidStreamUrl = (url: string): boolean => {
  if (!url) return false;
  
  // Check for m3u8 streams
  if (url.includes('.m3u8')) return true;
  
  // Check for YouTube URLs
  const youtubePatterns = [
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/,
    /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]+/,
    /^(https?:\/\/)?(www\.)?youtu\.be\/[\w-]+/
  ];
  
  return youtubePatterns.some(pattern => pattern.test(url));
};

export const isYouTubeUrl = (url: string): boolean => {
  const youtubePatterns = [
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/,
    /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]+/,
    /^(https?:\/\/)?(www\.)?youtu\.be\/[\w-]+/
  ];
  
  return youtubePatterns.some(pattern => pattern.test(url));
};