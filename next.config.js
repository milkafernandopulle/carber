/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
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
