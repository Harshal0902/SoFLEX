import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/en/email-api/:slug*',
                destination: '/api/email/:slug*',
            },
            {
                source: '/en/withdraw-email-api/:slug*',
                destination: '/api/withdraw-email/:slug*',
            },
            {
                source: '/ingest/:path*',
                destination: 'https://us.i.posthog.com/:path*',
            },
        ]
    },
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    webpack: (config) => {
        config.externals.push('pino-pretty', 'lokijs', 'encoding');
        return config;
    }
};

export default withNextIntl(nextConfig);
