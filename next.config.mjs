/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        styledComponents: true,
    },
    output: "standalone",
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'img.sciwiki.org',
          },
        ],
      },
    // typescript:{
    //     ignoreBuildErrors: true
    // }
};

export default nextConfig;
