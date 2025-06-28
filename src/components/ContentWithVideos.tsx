import React from 'react';
import { replaceVideoUrlsWithEmbeds, VideoInfo } from '@/lib/videoEmbed';

interface ContentWithVideosProps {
  content: string;
  className?: string;
}

const ContentWithVideos: React.FC<ContentWithVideosProps> = ({ content, className = "" }) => {
  const { text: processedText, videos } = replaceVideoUrlsWithEmbeds(content);

  // Split the text by video placeholders and render accordingly
  const renderContent = () => {
    if (videos.length === 0) {
      return <p className={className}>{content}</p>;
    }

    const parts = processedText.split(/\[VIDEO_[^\]]+\]/);
    const videoIndex = 0;

    return (
      <div className={className}>
        {parts.map((part, index) => {
          if (index === 0) {
            return part ? <p key={index}>{part}</p> : null;
          }

          const video = videos[index - 1];
          if (!video) return null;

          return (
            <React.Fragment key={index}>
              {part && <p>{part}</p>}
              <div className="my-4 rounded-lg overflow-hidden shadow-lg">
                <iframe
                  width="100%"
                  height="315"
                  src={video.embedUrl}
                  title={`${video.platform} video`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full"
                />
                <div className="p-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {video.platform.charAt(0).toUpperCase() + video.platform.slice(1)} Video
                  </p>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return renderContent();
};

export default ContentWithVideos; 