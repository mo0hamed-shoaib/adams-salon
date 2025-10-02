"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Phone, Users } from 'lucide-react';
import { WorkingHours, ShopStatus } from '@/lib/types';
import { useTranslations } from 'next-intl';

interface ContactSectionProps {
  status: ShopStatus;
  workingHours: WorkingHours[];
}

export function ContactSection({ status, workingHours }: ContactSectionProps) {
  const t = useTranslations('contact');
  const [currentTime, setCurrentTime] = useState(new Date());
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '1234567890';
  const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER || '1234567890';

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

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
    
    // Convert times to minutes for easier comparison
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    const [openHour, openMin] = todayHours.openTime.split(':').map(Number);
    const [closeHour, closeMin] = todayHours.closeTime.split(':').map(Number);
    
    const openMinutes = openHour * 60 + openMin;
    const closeMinutes = closeHour * 60 + closeMin;
    
    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
  };

  const isOpen = isCurrentlyOpen();

  const handleWhatsAppClick = () => {
                const message = encodeURIComponent("Hi! I'd like to book an appointment at Adam's Salon.");
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handlePhoneClick = () => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t('title')}</h2>
          <p className="text-muted-foreground text-lg">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* WhatsApp Card */}
          <Card className="hover:shadow-lg transition-shadow flex flex-col h-full">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-xl">{t('whatsapp')}</CardTitle>
            </CardHeader>
            <CardContent className="text-center flex flex-col flex-grow">
              <p className="text-muted-foreground mb-6 flex-grow">
                {t('whatsappDescription')}
              </p>
              <Button 
                onClick={handleWhatsAppClick}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                {t('chatWhatsapp')}
              </Button>
            </CardContent>
          </Card>

          {/* Phone Card */}
          <Card className="hover:shadow-lg transition-shadow flex flex-col h-full">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                <Phone className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl">{t('callUs')}</CardTitle>
            </CardHeader>
            <CardContent className="text-center flex flex-col flex-grow">
              <p className="text-muted-foreground mb-6 flex-grow">
                {t('callDescription')}
              </p>
              <Button 
                onClick={handlePhoneClick}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Phone className="h-5 w-5 mr-2" />
                {t('callNow')}
              </Button>
            </CardContent>
          </Card>

          {/* Walk-ins Card */}
          <Card className="hover:shadow-lg transition-shadow flex flex-col h-full">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle className="text-xl">{t('walkIns')}</CardTitle>
            </CardHeader>
            <CardContent className="text-center flex flex-col flex-grow">
              <p className="text-muted-foreground mb-6 flex-grow">
                {t('walkInsDescription')}
              </p>
              <Button 
                variant="outline"
                className="w-full"
                size="lg"
                disabled={!isOpen}
              >
                <Users className="h-5 w-5 mr-2" />
                {isOpen ? t('weAreOpen') : t('currentlyClosed')}
              </Button>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    </section>
  );
}
