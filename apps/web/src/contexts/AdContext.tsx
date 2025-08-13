'use client';

import { createContext, useContext, useState, useEffect } from 'react';

export interface AdPosition {
  id: string;
  name: string;
  position: 'header' | 'sidebar' | 'content-top' | 'content-bottom' | 'footer';
  size: 'banner' | 'rectangle' | 'skyscraper' | 'square';
  enabled: boolean;
  responsive: boolean;
}

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  startDate: Date;
  endDate: Date;
  active: boolean;
  position: string;
  priority: number;
}

interface AdContextType {
  ads: Advertisement[];
  positions: AdPosition[];
  isLoading: boolean;
  error: string | null;
  getAdsByPosition: (position: string) => Advertisement[];
  refreshAds: () => void;
}

const defaultPositions: AdPosition[] = [
  {
    id: 'header-banner',
    name: 'Üst Banner',
    position: 'header',
    size: 'banner',
    enabled: true,
    responsive: true,
  },
  {
    id: 'sidebar-top',
    name: 'Yan Panel Üst',
    position: 'sidebar',
    size: 'rectangle',
    enabled: true,
    responsive: true,
  },
  {
    id: 'sidebar-bottom',
    name: 'Yan Panel Alt',
    position: 'sidebar',
    size: 'rectangle',
    enabled: true,
    responsive: true,
  },
  {
    id: 'content-top',
    name: 'İçerik Üst',
    position: 'content-top',
    size: 'banner',
    enabled: true,
    responsive: true,
  },
  {
    id: 'content-bottom',
    name: 'İçerik Alt',
    position: 'content-bottom',
    size: 'banner',
    enabled: true,
    responsive: true,
  },
  {
    id: 'footer-banner',
    name: 'Alt Banner',
    position: 'footer',
    size: 'banner',
    enabled: true,
    responsive: true,
  },
];

const AdContext = createContext<AdContextType | undefined>(undefined);

export function AdProvider({ children }: { children: React.ReactNode }) {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [positions] = useState<AdPosition[]>(defaultPositions);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock ads for development
  const mockAds: Advertisement[] = [
    {
      id: '1',
      title: 'Hukuk Yazılımı',
      description: 'Profesyonel hukuk yazılımı ile işlerinizi kolaylaştırın',
      imageUrl: '/api/og-image?title=Hukuk Yazılımı&subtitle=Profesyonel çözümler&template=default',
      linkUrl: '#',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      active: true,
      position: 'sidebar-top',
      priority: 1,
    },
    {
      id: '2',
      title: 'Hukuk Eğitimi',
      description: 'Online hukuk eğitimleri ile kendinizi geliştirin',
      imageUrl: '/api/og-image?title=Hukuk Eğitimi&subtitle=Online kurslar&template=default',
      linkUrl: '#',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      active: true,
      position: 'sidebar-bottom',
      priority: 2,
    },
  ];

  useEffect(() => {
    // Load mock ads for development
    setAds(mockAds);
  }, []);

  const getAdsByPosition = (position: string): Advertisement[] => {
    return ads
      .filter(ad => ad.active && ad.position === position)
      .sort((a, b) => b.priority - a.priority);
  };

  const refreshAds = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In production, this would fetch from API
      // const response = await fetch('/api/ads');
      // const data = await response.json();
      // setAds(data);
      
      // For now, just refresh mock data
      setAds([...mockAds]);
    } catch (err) {
      setError('Reklamlar yüklenirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const value: AdContextType = {
    ads,
    positions,
    isLoading,
    error,
    getAdsByPosition,
    refreshAds,
  };

  return (
    <AdContext.Provider value={value}>
      {children}
    </AdContext.Provider>
  );
}

export function useAds() {
  const context = useContext(AdContext);
  if (context === undefined) {
    throw new Error('useAds must be used within an AdProvider');
  }
  return context;
}
