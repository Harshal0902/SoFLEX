import { Pathnames, LocalePrefix } from 'next-intl/routing'
export type Locale = (typeof locales)[number];

export const defaultLocale = 'en' as const;
export const locales = ['en', 'de', 'es', 'zh', 'ko', 'ja'] as const;

export const pathnames: Pathnames<typeof locales> = {
    '/': '/',
    // '/pathnames': {
    //     en: '/pathnames',
    //     de: '/pfadnamen'
    // }
};

export const localePrefix: LocalePrefix<typeof locales> = 'always';

export const port = process.env.PORT || 3000;
export const host = process.env.DEPLOYED_URL
    ? `https://${process.env.DEPLOYED_URL}`
    : `http://localhost:${port}`;
