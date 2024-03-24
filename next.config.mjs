/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/data-api/:slug*',
                destination: `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_BUCKET_ZONE}.amazonaws.com/:slug*`,
            },
            {
                source: '/email-api/:slug*',
                destination: `/api/email/:slug*`,
            }
        ]
    },
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    webpack: (config) => {
        config.externals.push('pino-pretty', 'lokijs', 'encoding');
        return config;
    }
};

export default nextConfig;