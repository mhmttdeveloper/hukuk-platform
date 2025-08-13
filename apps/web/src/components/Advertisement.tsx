'use client';

import { useAds, Advertisement as AdType } from '@/contexts/AdContext';
import { ExternalLink, X } from 'lucide-react';
import { useState } from 'react';

interface AdvertisementProps {
  position: string;
  className?: string;
  showCloseButton?: boolean;
}

export default function Advertisement({ position, className = '', showCloseButton = false }: AdvertisementProps) {
  const { getAdsByPosition } = useAds();
  const [closedAds, setClosedAds] = useState<Set<string>>(new Set());
  
  const ads = getAdsByPosition(position);
  
  if (ads.length === 0) {
    return null;
  }

  const ad = ads[0]; // Show first ad for the position

  if (closedAds.has(ad.id)) {
    return null;
  }

  const handleClose = () => {
    setClosedAds(prev => new Set(prev).add(ad.id));
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'banner':
        return 'w-full h-20 md:h-24';
      case 'rectangle':
        return 'w-full h-32 md:h-40';
      case 'skyscraper':
        return 'w-20 h-96';
      case 'square':
        return 'w-32 h-32';
      default:
        return 'w-full h-32';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Ad Label */}
        <div className="bg-blue-50 dark:bg-blue-900/20 px-2 py-1 text-xs text-blue-600 dark:text-blue-400 text-center border-b border-gray-200 dark:border-gray-700">
          Reklam
        </div>

        {/* Ad Content */}
        <div className="p-3">
          <div className="flex items-start space-x-3">
            {/* Ad Image */}
            <div className={`flex-shrink-0 ${getSizeClasses(ad.size)}`}>
              <img
                src={ad.imageUrl}
                alt={ad.title}
                className="w-full h-full object-cover rounded"
                onError={(e) => {
                  // Fallback to placeholder if image fails
                  const target = e.target as HTMLImageElement;
                  target.src = `https://via.placeholder.com/300x200/3b82f6/ffffff?text=${encodeURIComponent(ad.title)}`;
                }}
              />
            </div>

            {/* Ad Text */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1 line-clamp-2">
                {ad.title}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                {ad.description}
              </p>
              
              {/* CTA Button */}
              <a
                href={ad.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
              >
                <span>Detaylar</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Close Button */}
            {showCloseButton && (
              <button
                onClick={handleClose}
                className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Reklamı kapat"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
