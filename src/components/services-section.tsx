"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import Image from "next/image";
import { Service } from "@/lib/types";
import { useTranslations, useLocale } from "next-intl";

interface ServicesSectionProps {
  services: Service[];
}

export function ServicesSection({ services }: ServicesSectionProps) {
  const t = useTranslations("services");
  const locale = useLocale();

  return (
    <section className="py-16">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t("title")}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card
                key={service.id}
                className="group hover:shadow-lg transition-all duration-300 overflow-hidden p-0"
              >
                <div className="relative w-full aspect-[16/10]">
                  <Image
                    src={service.image}
                    alt={service.name[locale as "ar" | "en"]}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <CardHeader className="p-6 pb-0">
                  <CardTitle className="text-xl">
                    {service.name[locale as "ar" | "en"]}
                  </CardTitle>
                  {service.description && (
                    <p className="text-muted-foreground text-sm">
                      {service.description[locale as "ar" | "en"]}
                    </p>
                  )}
                </CardHeader>

                <CardContent className="p-6 pt-4">
                  <div className="text-center">
                    <span className="text-2xl font-bold text-primary">
                      {service.price} {locale === "ar" ? "جنيه" : "EGP"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
