import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://www.soflex.app',
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: 'https://www.soflex.app/privacy',
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.8,
        },
        {
            url: 'https://www.soflex.app/tos',
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.8,
        },
        {
            url: 'https://www.soflex.app/contact-us',
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.6,
        },
        {
            url: 'https://www.soflex.app/faqs',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: 'https://www.soflex.app/profile',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5,
        },
    ]
}
