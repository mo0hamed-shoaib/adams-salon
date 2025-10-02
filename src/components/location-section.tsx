"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Clock } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

interface LocationSectionProps {
  address: {
    ar: string;
    en: string;
  };
  mapsUrl: string;
}

export function LocationSection({ address, mapsUrl }: LocationSectionProps) {
  const t = useTranslations('location');
  const locale = useLocale();
  
  // Convert any Google Maps URL to embed format automatically
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // If it's already an embed URL, return as is
    if (url.includes('embed')) return url;
    
    // For short URLs, return the original URL - let the iframe handle the redirect
    // This is the most reliable approach for short URLs like maps.app.goo.gl
    if (url.includes('maps.app.goo.gl') || url.includes('goo.gl/maps')) {
      return url;
    }
    
    try {
      const urlObj = new URL(url);
      
      // Handle regular Google Maps URLs
      if (urlObj.hostname.includes('google.com') && urlObj.pathname.includes('/maps/')) {
        // Extract coordinates from the URL
        const coordsMatch = url.pathname.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        
        if (coordsMatch) {
          const [, lat, lng] = coordsMatch;
          // Create a simple embed URL with coordinates
          return `https://www.google.com/maps?q=${lat},${lng}&output=embed`;
        }
        
        // Try to extract place ID
        const placeIdMatch = url.pathname.match(/place\/([^\/\?]+)/);
        if (placeIdMatch) {
          const placeId = placeIdMatch[1];
          // Create embed URL with place ID
          return `https://www.google.com/maps/place/${placeId}/@data=!3m1!4b1!4m6!3m5!1s${placeId}!8m2!3d0!4d0!16s%2Fg%2F11c0&output=embed`;
        }
        
        // Try to extract search query
        const searchQuery = urlObj.searchParams.get('q');
        if (searchQuery) {
          return `https://www.google.com/maps?q=${encodeURIComponent(searchQuery)}&output=embed`;
        }
      }
      
    } catch (error) {
      console.log('Error parsing URL:', error);
    }
    
    // If all else fails, try to extract coordinates from the URL string directly
    const coordsMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coordsMatch) {
      const [, lat, lng] = coordsMatch;
      return `https://www.google.com/maps?q=${lat},${lng}&output=embed`;
    }
    
    // Final fallback: use the address for search
    const encodedAddress = encodeURIComponent(address[locale as 'ar' | 'en']);
    return `https://www.google.com/maps?q=${encodedAddress}&output=embed`;
  };
  
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    
    if (locale === 'ar') {
      // For Arabic, use English numbers but Arabic AM/PM indicators
      const timeString = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      // Replace AM/PM with Arabic equivalents
      return timeString.replace('AM', 'ص').replace('PM', 'م');
    } else {
      // For English, use English locale
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  };
  
  const handleDirectionsClick = () => {
    // Try to extract coordinates from the mapsUrl first
    const extractCoordinatesFromUrl = (url: string) => {
      // Look for latitude and longitude patterns in various formats
      const patterns = [
        // Pattern for embedded maps: !3d<lat>!4d<lng>
        /!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/,
        // Pattern for regular maps: @<lat>,<lng>
        /@(-?\d+\.?\d*),(-?\d+\.?\d*)/,
        // Pattern for query params: ?q=<lat>,<lng>
        /[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/
      ];
      
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
          return { lat: match[1], lng: match[2] };
        }
      }
      return null;
    };

    const coords = extractCoordinatesFromUrl(mapsUrl);
    
    let directionsUrl;
    if (coords) {
      // Use coordinates for more accurate directions
      directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;
    } else {
      // Fallback to address if coordinates not found
      const encodedAddress = encodeURIComponent(address[locale as 'ar' | 'en']);
      directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    }
    
    window.open(directionsUrl, '_blank');
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t('title')}</h2>
          <p className="text-muted-foreground text-lg">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Location Info */}
          <div className="space-y-6">
            <Card className="h-96 flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {t('ourLocation')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Adam's Salon</h3>
                    <p className="text-muted-foreground">{address[locale as 'ar' | 'en']}</p>
                  </div>
                  
                  <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>{t('mondayFriday')}:</strong> {formatTime('09:00')} - {formatTime('18:00')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>{t('saturday')}:</strong> {formatTime('10:00')} - {formatTime('17:00')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>{t('sunday')}:</strong> {t('closed')}
                    </span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleDirectionsClick}
                  className="w-full"
                  size="lg"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  {t('getDirections')}
                </Button>
              </CardContent>
            </Card>

          </div>

          {/* Google Maps */}
          <div className="space-y-4">
            <Card className="overflow-hidden p-0">
              <div className="relative w-full h-96">
                <iframe
                  src={getEmbedUrl(mapsUrl)}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Adam's Salon Location"
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </Card>

          </div>
        </div>
        </div>
      </div>
    </section>
  );
}