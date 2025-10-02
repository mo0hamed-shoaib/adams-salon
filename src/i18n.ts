import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // Ensure we have a valid locale, fallback to 'ar' if not
  const validLocale = ['ar', 'en'].includes(locale) ? locale : 'ar';
  
  return {
    locale: validLocale,
    messages: (await import(`../messages/${validLocale}.json`)).default
  };
});
