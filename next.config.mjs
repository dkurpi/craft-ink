/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['tyxkdlghmbazjuqlyusy.supabase.co'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'replicate.delivery',
        },
      ],
    },
  }
export default nextConfig;
