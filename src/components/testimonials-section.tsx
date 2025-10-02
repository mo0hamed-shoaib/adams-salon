"use client"

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { Testimonial } from '@/lib/types';
import { useTranslations, useLocale } from 'next-intl';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const t = useTranslations('testimonials');
  const locale = useLocale();
  
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
        }`}
      />
    ));
  };

  return (
    <section className="py-16">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t('title')}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="h-full flex flex-col">
              <CardContent className="p-4 flex flex-col flex-grow">
                <div className="flex flex-col h-full">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {renderStars(testimonial.rating)}
                  </div>

                  {/* Comment */}
                  <blockquote className="text-muted-foreground italic flex-grow mb-4">
                    &quot;{testimonial.comment[locale as 'ar' | 'en']}&quot;
                  </blockquote>

                  {/* Customer Info */}
                  <div className="flex items-center gap-3 mt-auto">
                    <Avatar className="h-10 w-10">
                      <AvatarImage 
                        src={testimonial.avatar} 
                        alt={testimonial.name[locale as 'ar' | 'en']}
                      />
                      <AvatarFallback>
                        {testimonial.name[locale as 'ar' | 'en'].split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.name[locale as 'ar' | 'en']}</p>
                      <p className="text-sm text-muted-foreground">{t('verifiedCustomer')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <h3 className="text-3xl font-bold mb-6">{t('ctaTitle')}</h3>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            {t('ctaDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '1234567890';
                    const message = encodeURIComponent("Hi! I'd like to book an appointment at Adam's Salon.");
                const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
                window.open(whatsappUrl, '_blank');
              }}
              className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-lg"
              >
                {t('bookWhatsapp')}
              </button>
              <button
                onClick={() => window.open(`tel:${process.env.NEXT_PUBLIC_PHONE_NUMBER || '1234567890'}`, '_self')}
                className="px-8 py-4 border border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-lg font-medium transition-colors text-lg"
              >
                {t('callToBook')}
              </button>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
