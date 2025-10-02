"use client"

import { useState, useEffect } from 'react';
import { HeroSection } from '@/components/hero-section';
import { ContactSection } from '@/components/contact-section';
import { ServicesSection } from '@/components/services-section';
import { LocationSection } from '@/components/location-section';
import { TestimonialsSection } from '@/components/testimonials-section';
import { ShopData } from '@/lib/types';
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('common');
  const [shopData, setShopData] = useState<ShopData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShopData();
  }, []);

  const fetchShopData = async () => {
    try {
      const response = await fetch('/api/shop-data');
      const data = await response.json();
      setShopData(data);
    } catch (error) {
      console.error('Failed to fetch shop data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!shopData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('error')}</h1>
          <p className="text-muted-foreground">{t('refresh')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection status={shopData.status} workingHours={shopData.workingHours} />
      
      {/* Contact Section */}
      <ContactSection status={shopData.status} workingHours={shopData.workingHours} />
      
      {/* Services Section */}
      <ServicesSection services={shopData.services} />
      
      {/* Location Section */}
      <LocationSection 
        address={shopData.location.address}
        mapsUrl={shopData.location.mapsUrl}
      />
      
      {/* Testimonials Section */}
      <TestimonialsSection testimonials={shopData.testimonials} />
    </div>
  );
}
