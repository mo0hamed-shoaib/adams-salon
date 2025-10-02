"use client"

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = () => {
    const newLocale = locale === 'ar' ? 'en' : 'ar';
    
    // Get the path without the current locale prefix
    let pathWithoutLocale = pathname.replace(`/${locale}`, '');
    
    // If pathWithoutLocale is empty (e.g., we're on /en), it means we're on the root
    if (pathWithoutLocale === '') {
      pathWithoutLocale = '/';
    }
    
    // Build the new path
    const newPath = pathWithoutLocale === '/' ? `/${newLocale}` : `/${newLocale}${pathWithoutLocale}`;
    
    router.replace(newPath);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={switchLanguage}
      className="h-8 w-8 p-0 relative"
      aria-label={`Switch to ${locale === 'ar' ? 'English' : 'Arabic'}`}
    >
      <Languages className="h-4 w-4" />
      <span className="absolute -bottom-1 -right-1 text-[10px] font-medium bg-background border rounded-sm px-1 leading-none">
        {locale.toUpperCase()}
      </span>
    </Button>
  );
}
