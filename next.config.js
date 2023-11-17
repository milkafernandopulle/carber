/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    }
    , experimental: {
        serverActions: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'uwvifxs19mkqloso.public.blob.vercel-storage.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
}

module.exports = nextConfig
