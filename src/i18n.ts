import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  const validLocale = (['ar', 'en'].includes(locale as string) ? locale : 'ar') as 'ar' | 'en';
  return {
    locale: validLocale,
    messages: (await import(`../messages/${validLocale}.json`)).default
  };
});
