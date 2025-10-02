"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, UserPlus, Timer } from 'lucide-react';
import { ShopStatus, WorkingHours } from '@/lib/types';
import { useTranslations, useLocale } from 'next-intl';

interface HeroSectionProps {
  status: ShopStatus;
  workingHours: WorkingHours[];
}

export function HeroSection({ status, workingHours }: HeroSectionProps) {
  const t = useTranslations('hero');
  const locale = useLocale();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const formatWorkingHours = (time: string) => {
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

  const getTodayWorkingHours = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayHours = workingHours.find(day => day.day === today);
    return todayHours;
  };

  const isCurrentlyOpen = () => {
    // Check if there's a manual override for today
    if (status.manualOverride) {
      const overrideDate = new Date(status.manualOverride.lastUpdated);
      const today = new Date();
      
      // If the override was set today, use it
      if (overrideDate.toDateString() === today.toDateString()) {
        return status.manualOverride.isOpen;
      }
    }

    // Otherwise, use working hours logic
    const todayHours = getTodayWorkingHours();
    if (!todayHours || !todayHours.isOpen) {
      return false;
    }

    const now = currentTime;
    const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // Convert times to minutes for easier comparison
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    const [openHour, openMin] = todayHours.openTime.split(':').map(Number);
    const [closeHour, closeMin] = todayHours.closeTime.split(':').map(Number);
    
    const openMinutes = openHour * 60 + openMin;
    const closeMinutes = closeHour * 60 + closeMin;
    
    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
  };

  const todayHours = getTodayWorkingHours();
  const isOpen = isCurrentlyOpen();

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Image/Video */}
      <div className="relative w-full aspect-[9/16] sm:aspect-[4/3] lg:aspect-[16/9] max-w-[1800px] mx-auto">
        <Image
          src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1920&h=1080&fit=crop"
          alt="Adam&apos;s Salon Interior"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Logo Overlay */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="relative">
          <Image
            src="/adams-logo.png"
            alt="Adam&apos;s Salon Logo"
            width={120}
            height={120}
            className="drop-shadow-2xl lg:w-40 lg:h-40"
            priority
          />
        </div>
      </div>

      {/* Status Card */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-sm lg:max-w-md xl:max-w-lg px-4">
        <Card className="bg-background/95 backdrop-blur-sm border-2">
          <CardContent className="p-6 lg:p-8 xl:p-10">
            <div className="space-y-4 lg:space-y-6 xl:space-y-8">
              {/* Shop Status & Hours */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="font-semibold lg:text-lg xl:text-xl">
                      {isOpen ? t('open') : t('closed')}
                    </span>
                </div>
                {todayHours && (
                  <span className="text-sm lg:text-base xl:text-lg text-muted-foreground">
                    {todayHours.isOpen 
                      ? `${formatWorkingHours(todayHours.openTime)} - ${formatWorkingHours(todayHours.closeTime)}`
                      : 'Closed Today'
                    }
                  </span>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 lg:gap-6 xl:gap-8">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Users className="h-4 w-4 lg:h-5 lg:w-5 xl:h-6 xl:w-6 text-muted-foreground" />
                  </div>
                  <div className="text-2xl lg:text-3xl xl:text-4xl font-bold">{status.clientsInShop}</div>
                  <div className="text-xs lg:text-sm xl:text-base text-muted-foreground">{t('inShop')}</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <UserPlus className="h-4 w-4 lg:h-5 lg:w-5 xl:h-6 xl:w-6 text-muted-foreground" />
                  </div>
                  <div className="text-2xl lg:text-3xl xl:text-4xl font-bold">{status.clientsComing}</div>
                  <div className="text-xs lg:text-sm xl:text-base text-muted-foreground">{t('coming')}</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Timer className="h-4 w-4 lg:h-5 lg:w-5 xl:h-6 xl:w-6 text-muted-foreground" />
                  </div>
                  <div className="text-2xl lg:text-3xl xl:text-4xl font-bold">{status.waitingTime}</div>
                  <div className="text-xs lg:text-sm xl:text-base text-muted-foreground">{t('minWait')}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </section>
  );
}
