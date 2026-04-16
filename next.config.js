/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'mwfegxszunlsbdnbkmsp.supabase.co',
            'm.media-amazon.com',
        ],
    },
    // Disable cache for API routes
    async headers() {
        return [{
            source: '/api/:path*',
            headers: [
                { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
            ],
        }, ]
    },
}

module.exports = nextConfig