"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Settings } from "lucide-react"
import Image from "next/image"
import { useTranslations } from 'next-intl'

export function MainNavigation() {
  const t = useTranslations('navigation');
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 navigation">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Adam's Barbershop Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src="/adams-logo.png"
                  alt="Adam&apos;s Salon Logo"
                  width={40}
                  height={40}
                  className="rounded-full"
                  priority
                />
              </div>
                          <span className="font-bold text-xl">Adam&apos;s Salon</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className="h-8 w-8 p-0"
              aria-label={t('dashboard')}
            >
              <Link href="/dashboard">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
