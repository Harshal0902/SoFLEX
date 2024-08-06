import { MetadataRoute } from 'next'

const defaultLocale = 'en' as const;
const locales = ['en', 'de', 'es', 'zh', 'ko', 'ja'] as const;

const pathnames = ['/', '/privacy', '/tos', '/contact-us', '/faqs', '/profile'];
const host = 'https://www.soflex.fi';

export default function sitemap(): MetadataRoute.Sitemap {
    function getUrl(pathname: string, locale: string) {
        return `${host}/${locale}${pathname === '/' ? '' : pathname}`;
    }

    return pathnames.map((pathname) => ({
        url: getUrl(pathname, defaultLocale),
        lastModified: new Date(),
        alternates: {
            languages: Object.fromEntries(
                locales.map((locale) => [locale, getUrl(pathname, locale)])
            )
        }
    }));
}
