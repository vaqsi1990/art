import {getRequestConfig} from 'next-intl/server';

const locales = ['en', 'ka'] as const;
type AppLocale = (typeof locales)[number];

function isLocale(value: unknown): value is AppLocale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

export default getRequestConfig(async ({requestLocale}) => {
  const candidate = await requestLocale;
  const locale: AppLocale = isLocale(candidate) ? candidate : 'ka';

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});

