/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        styledComponents: true,
    },
    output: "standalone",
    typescript: {
        ignoreBuildErrors: true
      }
};

export default nextConfig;
