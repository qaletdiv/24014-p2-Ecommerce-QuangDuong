/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'picsum.photos',
            },
            {
                protocol: 'https',
                hostname: 'down-vn.img.susercontent.com',
                pathname: '/file/**',
            },
        ],
    },
};

export default nextConfig;
