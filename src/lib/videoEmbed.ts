// Video URL patterns for different platforms
const videoPatterns = {
  youtube: {
    pattern: /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
    embedUrl: (id: string) => `https://www.youtube.com/embed/${id}`,
    thumbnailUrl: (id: string) => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
  },
  vimeo: {
    pattern: /(?:vimeo\.com\/)(\d+)/i,
    embedUrl: (id: string) => `https://player.vimeo.com/video/${id}`,
    thumbnailUrl: (id: string) => `https://vumbnail.com/${id}.jpg`
  },
  dailymotion: {
    pattern: /(?:dailymotion\.com\/video\/)([a-zA-Z0-9]+)/i,
    embedUrl: (id: string) => `https://www.dailymotion.com/embed/video/${id}`,
    thumbnailUrl: (id: string) => `https://www.dailymotion.com/thumbnail/video/${id}`
  }
};

export interface VideoInfo {
  platform: string;
  videoId: string;
  embedUrl: string;
  thumbnailUrl: string;
  originalUrl: string;
}

export function extractVideoInfo(url: string): VideoInfo | null {
  for (const [platform, config] of Object.entries(videoPatterns)) {
    const match = url.match(config.pattern);
    if (match) {
      const videoId = match[1];
      return {
        platform,
        videoId,
        embedUrl: config.embedUrl(videoId),
        thumbnailUrl: config.thumbnailUrl(videoId),
        originalUrl: url
      };
    }
  }
  return null;
}

export function findVideoUrls(text: string): string[] {
  const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const urls = text.match(urlRegex) || [];
  return urls.filter(url => extractVideoInfo(url) !== null);
}

export function replaceVideoUrlsWithEmbeds(text: string): { text: string; videos: VideoInfo[] } {
  const videoUrls = findVideoUrls(text);
  const videos: VideoInfo[] = [];
  let processedText = text;

  videoUrls.forEach(url => {
    const videoInfo = extractVideoInfo(url);
    if (videoInfo) {
      videos.push(videoInfo);
      // Replace the URL with a placeholder that we can identify later
      processedText = processedText.replace(url, `[VIDEO_${videoInfo.platform}_${videoInfo.videoId}]`);
    }
  });

  return { text: processedText, videos };
}

export function renderVideoEmbed(videoInfo: VideoInfo): string {
  const { platform, embedUrl } = videoInfo;
  
  const commonAttributes = 'frameborder="0" allowfullscreen';
  
  switch (platform) {
    case 'youtube':
      return `<iframe width="100%" height="315" src="${embedUrl}" ${commonAttributes}></iframe>`;
    case 'vimeo':
      return `<iframe width="100%" height="315" src="${embedUrl}" ${commonAttributes}></iframe>`;
    case 'dailymotion':
      return `<iframe width="100%" height="315" src="${embedUrl}" ${commonAttributes}></iframe>`;
    default:
      return `<iframe width="100%" height="315" src="${embedUrl}" ${commonAttributes}></iframe>`;
  }
} 